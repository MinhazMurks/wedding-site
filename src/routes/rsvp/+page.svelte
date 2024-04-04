<script lang="ts">
	import { onMount, tick } from "svelte";
	import { fade } from "svelte/transition";
	import js from "jquery";
	import SegmentedButton from "$lib/SegmentedButton.svelte";
	import { PUBLIC_WEDDING_SERVICE_HOST } from "$env/static/public";
	import { gsap } from "gsap";
	import { ScrollTrigger } from "gsap/ScrollTrigger";
	import Lenis from "@studio-freight/lenis";
	import type { GetRsvpResponse } from "$lib/types/Responses";
	import { ErrorResponse } from "$lib/types/Responses";
	import { InputType } from "$lib/types/Events";

	let formContainer: HTMLElement;

	onMount(() => {
		window.js = js;

		gsap.registerPlugin(ScrollTrigger);

		const lenis = new Lenis({
			lerp: 0.1,
			smoothWheel: true,
		});

		function raf(time: number) {
			if (lenis) {
				lenis.raf(time);
				requestAnimationFrame(raf);
			}
		}

		requestAnimationFrame(raf);
		lenis.on("scroll", () => ScrollTrigger.update());

		initAnims();

		return () => lenis.destroy();
	});

	const usNumberFormat = [2, 5];

	let loading = false;

	let declined = false;
	let accepted = false;
	let retrieved = false;
	let attending = false;

	let firstName = "";
	let lastName = "";
	let email = "";
	let phoneNumber = "";
	let phoneNumberVisual = "";
	let foodSelection = "CHICKEN";
	let plusOneEnabled = false;
	let plusOneUsed = false;
	let plusOneFoodSelection: string | null = null;
	let rsvpMessage = "";

	let errorMessage: string | null = null;
	let errorMessages: string[] | null = null;

	function initAnims() {
		gsap.from(formContainer, {
			opacity: 0,
			y: 50,
			ease: "power2.inOut",
			duration: .8,
		});
	}

	function updateHeightManually(oldHeight: number) {
		const timeline = gsap.timeline();
		const formContainerTrueHeight =
			formContainer.offsetHeight -
			formContainer.style.paddingBottom.length -
			formContainer.style.paddingTop.length;

		console.log("oldHeight", oldHeight);
		console.log("newHeight", formContainerTrueHeight);
		console.log("newHeightFull", formContainer.offsetHeight);

		timeline.set(
			formContainer,
			{
				height: oldHeight,
			},
		).to(formContainer,
			{
				height: "auto"
			});
	}

	function getRsvp() {
		loading = true;
		fetch(`${PUBLIC_WEDDING_SERVICE_HOST}/api/v1/rsvp?` + new URLSearchParams({
			firstName: firstName,
			lastName: lastName,
		}), {
			method: "GET",
			headers: {
				"Content-Type": "application/json",
			},
		})
			.then(async response => {
				if (response.status >= 500) {
					throw new Error("Something went wrong");
				} else if (response.status >= 400) {
					throw await response.json() as never as ErrorResponse;
				}
				return response.json();
			})
			.then(async data => {
				data = data as GetRsvpResponse;

				const currentContainerMaskHeight = formContainer.offsetHeight;

				firstName = data.firstName;
				lastName = data.lastName;
				plusOneEnabled = data.plusOneEnabled;

				loading = false;
				retrieved = true;
				errorMessage = null;
				errorMessages = null;

				await tick();
				updateHeightManually(currentContainerMaskHeight);
			})
			.catch(async error => {
				const currentContainerMaskHeight = formContainer.offsetHeight;

				loading = false;
				errorMessage = error.message;

				await tick();
				updateHeightManually(currentContainerMaskHeight);
			});
	}

	function sendDecline() {
		loading = true;

		fetch(`${PUBLIC_WEDDING_SERVICE_HOST}/api/v1/rsvp?`, {
			method: "PUT",
			headers: {
				"Content-Type": "application/json",
			},
			body: JSON.stringify({
				attending: false,
				firstName: firstName,
				lastName: lastName,
			}),
		})
			.then(async response => {
				if (response.status >= 500) {
					throw new Error("Something went wrong");
				} else if (response.status >= 400) {
					const errorResponse = await response.json() as never as ErrorResponse;
					throw new Error(errorResponse.message);
				}
				return response.json();
			})
			.then(async () => {
				const currentContainerMaskHeight = formContainer.offsetHeight;

				loading = false;
				declined = true;
				errorMessage = null;

				await tick();
				updateHeightManually(currentContainerMaskHeight);
			})
			.catch(async error => {
				const currentContainerMaskHeight = formContainer.offsetHeight;

				loading = false;
				errorMessage = error.message;

				await tick();
				updateHeightManually(currentContainerMaskHeight);
			});
	}

	async function confirmAttendance() {
		attending = true;

		const currentContainerMaskHeight = formContainer.offsetHeight;
		await tick();

		updateHeightManually(currentContainerMaskHeight);
	}

	function submit() {
		fetch(`${PUBLIC_WEDDING_SERVICE_HOST}/api/v1/rsvp?`, {
			method: "PUT",
			headers: {
				"Content-Type": "application/json",
			},
			body: JSON.stringify({
				attending: true,
				firstName: firstName,
				lastName: lastName,
				email: email,
				phoneNumber: phoneNumber,
				foodSelection: foodSelection,
				plusOneUsed: plusOneUsed,
				plusOneFoodSelection: plusOneFoodSelection,
				message: rsvpMessage,
			}),
		})
			.then(async response => {
				if (response.status >= 500) {
					throw new Error("Something went wrong");
				} else if (response.status >= 400) {
					throw await response.json() as never as ErrorResponse;
				}
				return response.json();
			})
			.then(async () => {
				const currentContainerMaskHeight = formContainer.offsetHeight;

				loading = false;
				accepted = true;
				errorMessage = null;
				errorMessages = null;

				await tick();
				updateHeightManually(currentContainerMaskHeight);
			})
			.catch(async error => {
				const currentContainerMaskHeight = formContainer.offsetHeight;

				loading = false;

				if (error.message) {
					errorMessage = error.message;
					console.log(error.message);
				} else if (error.messages) {
					errorMessages = error.messages;
					console.log(error.messages);
				}

				await tick();
				updateHeightManually(currentContainerMaskHeight);
			});
	}

	function validateFirstName(event: Event) {
		let inputEventTarget = (event.target) as HTMLInputElement;
		firstName = inputEventTarget.value;
	}

	function validateLastName(event: Event) {
		let inputEventTarget = (event.target) as HTMLInputElement;
		lastName = inputEventTarget.value;
	}

	function validateNumberInput(event: Event) {
		event.preventDefault();
		const inputEventTarget = event.target as HTMLInputElement;
		const inputEvent = event as InputEvent;
		const newCharacter = inputEvent.data;

		switch (inputEvent.inputType) {
			case InputType.INSERT_FROM_PASTE:
			case InputType.INSERT:
				if (phoneNumber.length < 10) {
					if (newCharacter && newCharacter.match(/\d/)) {
						phoneNumber += newCharacter;
						convertPhoneNumberInput();
					}
					convertPhoneNumberInput();
				}
				inputEventTarget.value = phoneNumberVisual;
				break;
			case InputType.DELETE_FORWARD:
			case InputType.DELETE_BACKWARD:
				if (inputEvent.target)
					phoneNumber = inputEventTarget.value.replace(/\D/g, "");
				convertPhoneNumberInput();
				break;
			default:
				inputEventTarget.value = phoneNumberVisual;
		}
	}

	function convertPhoneNumberInput() {
		phoneNumberVisual = "";
		for (let i = 0; i < phoneNumber.length; i++) {
			phoneNumberVisual += phoneNumber.charAt(i);
			if (usNumberFormat.includes(i) && i + 1 < phoneNumber.length) {
				phoneNumberVisual += "-";
			}
		}
	}

	function validatePhoneNumberPasteInput(event: Event) {
		event.preventDefault();
		const pastedData = (event as ClipboardEvent).clipboardData?.getData("text");

		if (pastedData) {
			phoneNumber += pastedData.replace(/\D/g, "");
			phoneNumber = phoneNumber.substring(0, 10);
			convertPhoneNumberInput();
		}
	}

	function updateFoodSelection(value: string): void {
		foodSelection = value;
	}

	function updatePlusOneFoodSelection(value: string): void {
		plusOneFoodSelection = value;
	}

	async function updatePlusOne(value: string): Promise<void> {
		const currentContainerMaskHeight =
			formContainer.offsetHeight -
			formContainer.style.paddingTop.length -
			formContainer.style.paddingBottom.length -
			formContainer.style.marginTop.length -
			formContainer.style.marginBottom.length;

		plusOneUsed = value == "true";
		plusOneFoodSelection = value ? "CHICKEN" : null

		await tick();
		updateHeightManually(currentContainerMaskHeight);
	}

	function fullNameTitleCase(): string {
		if (firstName && lastName && lastName.length > 0 && firstName.length > 0) {
			let restOfFirstName = "";
			let restOfLastName = "";

			if (firstName.length > 1 && lastName.length > 1) {
				restOfFirstName = firstName.substring(1);
				restOfLastName = lastName.substring(1);
			}

			return `${firstName.charAt(0).toUpperCase()}${restOfFirstName} ${lastName.charAt(0).toUpperCase()}${restOfLastName}`;
		}
		return "";
	}
</script>

<div class="rsvp-page-container">
		<div id="form-container" class="form-container" class:loading bind:this={formContainer}>
			{#if loading}
				<div transition:fade={{duration: 100}} class="lds-heart">
					<div></div>
				</div>
			{/if}
			<h1>RSVP</h1>
			<form class="form-fields" on:submit={submit}>
				{#if (attending || !retrieved) && !accepted}
					<input
						class="input-field"
						type="text"
						name="firstName"
						placeholder="First Name"
						in:fade={{duration:200}}
						bind:value={firstName}
						on:input={e => validateFirstName(e)}
						required
					/>
					<input
						class="input-field"
						type="text"
						name="lastName"
						placeholder="Last Name"
						in:fade={{duration:400}}
						bind:value={lastName}
						on:input={e => validateLastName(e)}
						required
					/>
				{/if}

				{#if retrieved && !declined && !attending && !accepted}
					<h2 in:fade>Will you be able to accept?</h2>
					<div in:fade class="attending-dialogue">
						<button
							class="submit-button rsvp-response response"
							type="button"
							on:click={confirmAttendance}
						>
							<span class="name">{fullNameTitleCase()}</span>
							<span class="status">Joyfully Accepts</span>
						</button>

						<button
							class="submit-button rsvp-response negative"
							type="button"
							on:click={sendDecline}
						>
							<span class="name">{fullNameTitleCase()}</span>
							<span class="status">Regretfully Declines</span>
						</button>
					</div>
				{/if}

				{#if declined || accepted}
					<div class="declined-dialogue">
						<h2 in:fade={{duration: 200}}>Thank you, your RSVP has been submitted successfully!</h2>
					</div>
				{/if}

				{#if attending && !accepted}
					<input
						class="input-field"
						type="email"
						name="email"
						placeholder="Email"
						bind:value={email}
						in:fade={{duration:600}}
						required
					/>
					<input
						class="input-field"
						type="text"
						name="phoneNumber"
						placeholder="Phone Number"
						value={phoneNumberVisual}
						in:fade={{duration:800}}
						on:input={e => validateNumberInput(e)}
						on:paste={e => validatePhoneNumberPasteInput(e)}
						required
					/>
					<div class="food-section">
						<h2>Make your food selection</h2>
						<div
							class="food-selection"
							in:fade={{duration:1000}}
						>
							<SegmentedButton
								name="group"
								defaultIndex={0}
								callback={updateFoodSelection}
								segments={[
							{
								label: "Chicken",
								value: "CHICKEN",
								bound: null,
							},
							{
								label: "Beef",
								value: "BEEF",
								bound: null,
							},
							{
								label: "Fish",
								value: "FISH",
								bound: null,
							}
						]}
							/>
						</div>
					</div>
					{#if plusOneEnabled}
						<div class="food-section">
							<h2>Will you be attending alone?</h2>
							<div
								class="food-selection"
								in:fade={{duration:1000}}
							>
								<SegmentedButton
									name="plus-one"
									defaultIndex={0}
									callback={updatePlusOne}
									segments={[
										{
											label: "Attending solo",
											value: "false",
											bound: null,
										},
										{
											label: "Bringing a Guest",
											value: "true",
											bound: null,
										}
									]}
								/>
							</div>
						</div>
						{#if plusOneUsed}
							<div class="food-section">
								<h2>Make your guest's food selection</h2>
								<div
									class="food-selection"
									in:fade={{duration:1000}}
								>
									<SegmentedButton
										name="guest-food-selection"
										defaultIndex={0}
										callback={updatePlusOneFoodSelection}
										segments={[
											{
												label: "Chicken",
												value: "CHICKEN",
												bound: null,
											},
											{
												label: "Beef",
												value: "BEEF",
												bound: null,
											},
											{
												label: "Fish",
												value: "FISH",
												bound: null,
											}
										]}
									/>
								</div>
							</div>
						{/if}
					{/if}
					<div class="text-box-container">
						<textarea
							class="input-field text-box"
							name="rsvp-message"
							placeholder="Any information you want us to know"
							in:fade={{duration:800}}
							bind:value={rsvpMessage}
						/>
					</div>
					<input id="wtf" class="submit-button" type="submit" name="submit" value="Submit">
				{:else if !retrieved}
					<input id="find-invitation-button" class="submit-button" type="button" on:click={getRsvp} name="submit"
								 value="Find Invitation">
				{/if}

				{#if errorMessage}
					<div in:fade class="error-message">{errorMessage}</div>
				{:else if errorMessages}
					{#each errorMessages as message}
						<div in:fade class="error-message">{message}</div>
					{/each}
				{/if}
			</form>
		</div>
</div>

<style>
    .rsvp-page-container {
        display: flex;
        justify-content: center;
        align-items: center;
        font-family: "Jost", sans-serif;

        --light-text-color: #d6d6d6;
    }

    h1 {
        font-size: max(6vw, 10vh);
        color: var(--light-text-color);
        margin-top: 2rem;
        margin-bottom: 2rem;
    }

    h2 {
        font-size: max(1.5vw, 2vh);
        color: var(--light-text-color);
        margin-top: 2rem;
        margin-bottom: 2rem;
    }

    .form-container {
				margin: 10px;
        padding: 20px;
        display: flex;
        flex-direction: column;
        justify-content: space-around;
        align-items: center;
        border-radius: 5px;
        background: #000000;
        width: max(40%, 500px);
        max-width: 600px;
        height: fit-content;


        overflow: hidden;

        --input-height: 3em;
    }

    .loading {
        opacity: 0.8;
        cursor: default;
        pointer-events: none;
    }

    .attending-dialogue {
        display: flex;
        flex-direction: row;
        justify-content: center;
        column-gap: 10px;
    }

    .declined-dialogue {
        display: flex;
        justify-content: center;
        align-items: center;
        text-align: center;
    }

    .input-field {
        box-sizing: border-box;
        border: none;
        background: #dfdfdf;
        height: var(--input-height);
        padding: 10px;
        border-radius: 5px;
        width: 85%;
    }

    .input-field::placeholder {
        color: #595959;
    }

    .input-field:focus {
        color: black;
        border: none;
        outline: none;
    }

		.text-box-container {
				display: flex;
				justify-content: center;
				align-items: center;
				width: 100%;
				margin-top: 20px;
		}

		.text-box {
        font-family: Jost, serif;
        font-size: var(--font-size);
				width: 85%;
				height: 100%;
		}

    .form-fields {
        display: flex;
        flex-direction: column;
        align-items: center;
        row-gap: 5px;
        width: 100%;
    }

    .food-section {
        display: flex;
        flex-direction: column;
        justify-content: center;
        align-items: center;
        width: 100%;
    }

    .food-selection {
        box-sizing: border-box;
        display: flex;
        height: var(--input-height);
        width: 85%;
        flex-direction: row;
        column-gap: 30px;
        justify-content: space-around;
    }

    .submit-button {
        margin-top: 10px;
        border: none;
        background: #cdcdcd;
        border-radius: 5px;
        padding: 10px;
    }

    .submit-button:hover {
        cursor: pointer;
        transform: scale(1.05);
        transition: 100ms;
    }

    .rsvp-response {
        border-radius: 0;
        display: flex;
        flex-direction: column;
        justify-content: center;
        align-items: center;
        color: black;
        padding: 50px;
    }

    .response {
        background: white;
    }

    .negative {
        border-color: white;
        border-style: ridge;
        border-width: 1px;
        background: black;
        color: white;
    }

    .rsvp-response .name {
        font-size: max(2vw, 3vh);
        font-family: "Parisienne", cursive;
    }

    .rsvp-response .status {
        font-size: max(.8vw, 1vh);
        font-weight: 600;
        font-style: italic;
    }

    .error-message {
        background: rgb(143, 7, 7);
        background: linear-gradient(209deg, rgba(143, 7, 7, 1) 50%, rgb(108, 4, 4) 90%);
        color: var(--light-text-color);
        border-radius: 5px;
        margin: 10px;
        padding: 10px 50px;

        box-shadow: 0 0 50px -8px rgba(0, 0, 0, 0.75);
        -webkit-box-shadow: 0 0 50px -8px rgba(0, 0, 0, 0.75);
        -moz-box-shadow: 0 0 50px -8px rgba(0, 0, 0, 0.75);
    }

    /*
		Pop in animation
		*/

    @keyframes animate-fade {
        0% {
            opacity: 0;
        }
        100% {
            opacity: 1;
        }
    }

    /*
		Loading Animation
		*/

    .lds-heart {
        display: inline-block;
        position: absolute;
        width: 80px;
        height: 80px;
        transform: rotate(45deg);
        transform-origin: 40px 40px;
    }

    .lds-heart div {
        top: 32px;
        left: 32px;
        position: absolute;
        width: max(4vw, 8vh);
        height: max(4vw, 8vh);
        background: #fff;
        animation: lds-heart 1.2s infinite cubic-bezier(0.215, 0.61, 0.355, 1);
    }

    .lds-heart div:after,
    .lds-heart div:before {
        content: " ";
        position: absolute;
        display: block;
        width: max(4vw, 8vh);
        height: max(4vw, 8vh);
        background: #fff;
    }

    .lds-heart div:before {
        left: min(-2vw, -5vh);
        border-radius: 50% 0 0 50%;
    }

    .lds-heart div:after {
        top: min(-2vw, -5vh);
        border-radius: 50% 50% 0 0;
    }

    @keyframes lds-heart {
        0% {
            transform: scale(0.95);
        }
        5% {
            transform: scale(1.1);
        }
        39% {
            transform: scale(0.85);
        }
        45% {
            transform: scale(1);
        }
        60% {
            transform: scale(0.95);
        }
        100% {
            transform: scale(0.9);
        }
    }

</style>