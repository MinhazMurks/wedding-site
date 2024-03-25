<script lang="ts">
	import { onMount, tick } from "svelte";
	import { fade } from "svelte/transition";
	import js from "jquery";
	import SegmentedButton from "./SegmentedButton.svelte";

	let formContainerMask: HTMLElement;

	const updateHeightManually = (oldHeight: number) => {
		const formContainerHeight = js("#form-container").outerHeight(true) || 0;
		js("#form-container-mask").outerHeight(oldHeight);
		js("#form-container-mask").outerHeight(formContainerHeight);

		setTimeout(() => {
				js("#form-container-mask").css({
					height: "auto"
				});
			}, 800
		);
	};

	onMount(() => {
		window.js = js;
	});

	enum InputType {
		INSERT = "insertText",
		INSERT_FROM_PASTE = "insertFromPaste",
		DELETE_BACKWARD = "deleteContentBackward",
		DELETE_FORWARD = "deleteContentForward",
	}

	type GetRsvpResponse = {
		firstName: string,
		lastName: string,
		plusOneEnabled: boolean
	}

	type PutRsvpResponse = {
		success: boolean
	}

	type ErrorResponse = {
		message: string,
	}

	const weddingServiceHost = "localhost:8080";

	const usNumberFormat = [2, 5];

	let loading = false;

	let declined = false;
	let retrieved = false;
	let attending = false;

	let firstName = "";
	let lastName = "";
	let email = "";
	let phoneNumber = "";
	let phoneNumberVisual = "";
	let foodSelection = "chicken";

	let plusOneEnabled = false;
	let plusOneSelected = false;

	let errorMessage: string | null = null;

	function getRsvp() {
		loading = true;
		fetch(`http://${weddingServiceHost}/api/v1/rsvp?` + new URLSearchParams({
			firstName: firstName,
			lastName: lastName
		}), {
			method: "GET",
			headers: {
				"Content-Type": "application/json"
			}
		})
			.then(async response => {
				if (response.status >= 500) {
					throw new Error("Something went wrong");
				} else if (response.status >= 400) {
					const errorResponse = await response.json() as never as ErrorResponse;
					console.log(response);
					throw new Error(errorResponse.message);
				}
				return response.json();
			})
			.then(async data => {
				data = data as GetRsvpResponse;

				const currentContainerMaskHeight = formContainerMask.offsetHeight;

				firstName = data.firstName;
				lastName = data.lastName;
				plusOneEnabled = data.plusOneEnabled;

				loading = false;
				retrieved = true;
				errorMessage = null;

				await tick();
				updateHeightManually(currentContainerMaskHeight);
			})
			.catch(async error => {
				const currentContainerMaskHeight = formContainerMask.offsetHeight;

				loading = false;
				errorMessage = error.message;

				await tick();
				updateHeightManually(currentContainerMaskHeight);
			});
	}

	function sendDecline() {
		loading = true;

		fetch(`http://${weddingServiceHost}/api/v1/rsvp?`, {
			method: "PUT",
			headers: {
				"Content-Type": "application/json"
			},
			body: JSON.stringify({
				attending: false,
				firstName: firstName,
				lastName: lastName
			})
		})
			.then(async response => {
				if (response.status >= 500) {
					throw new Error("Something went wrong");
				} else if (response.status >= 400) {
					const errorResponse = await response.json() as never as ErrorResponse;
					console.log(response);
					throw new Error(errorResponse.message);
				}
				return response.json();
			})
			.then(async () => {

				const currentContainerMaskHeight = formContainerMask.offsetHeight;

				loading = false;
				declined = true;
				errorMessage = null;

				await tick();
				updateHeightManually(currentContainerMaskHeight);
			})
			.catch(async error => {
				const currentContainerMaskHeight = formContainerMask.offsetHeight;

				loading = false;
				errorMessage = error.message;

				await tick();
				updateHeightManually(currentContainerMaskHeight);
			});
	}

	async function confirmAttendance() {
		attending = true;

		const currentContainerMaskHeight = formContainerMask.offsetHeight;
		await tick();

		updateHeightManually(currentContainerMaskHeight);
	}

	function submit() {
		fetch(`http://${weddingServiceHost}/api/v1/rsvp?`, {
				method: "PUT",
				headers: {
					"Content-Type": "application/json"
				},
				body: JSON.stringify({
					attending: true,
					firstName: firstName,
					lastName: lastName,
					email: email,
					phoneNumber: phoneNumber,
					foodSelection: foodSelection,
					plusOneEnabled: plusOneEnabled,
				})
		})
			.then(async response => {
				if (response.status >= 500) {
					throw new Error("Something went wrong");
				} else if (response.status >= 400) {
					const errorResponse = await response.json() as never as ErrorResponse;
					console.log(response);
					throw new Error(errorResponse.message);
				}
				return response.json();
			})
			.then(async () => {

				const currentContainerMaskHeight = formContainerMask.offsetHeight;

				loading = false;
				declined = true;
				errorMessage = null;

				await tick();
				updateHeightManually(currentContainerMaskHeight);
			})
			.catch(async error => {
				const currentContainerMaskHeight = formContainerMask.offsetHeight;

				loading = false;
				errorMessage = error.message;

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

	function validateEmail(event: Event) {
		console.log("validateEmail", event);
	}

	function validateNumberInput(event: Event) {
		event.preventDefault();
		const inputEventTarget = event.target as HTMLInputElement;
		const inputEvent = event as InputEvent;
		const newCharacter = inputEvent.data;

		switch (inputEvent.inputType) {
			case InputType.INSERT_FROM_PASTE:
			case InputType.INSERT:
				console.log(`"match: ${newCharacter?.match(/\d/)}`);
				console.log(phoneNumber.length);


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

	function updatePlusOne(value: string): void {
		plusOneSelected = Boolean(value);
	}
</script>

<section>
	<div bind:this={formContainerMask} id="form-container-mask" class="form-container-mask">
		<div id="form-container" class="form-container" class:loading>
			{#if loading}
				<div transition:fade={{duration: 100}} class="lds-heart">
					<div></div>
				</div>
			{/if}
			<h1>RSVP</h1>
			<form class="form-fields" on:submit={submit}>
				{#if attending || !retrieved}
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

				{#if retrieved && !declined && !attending}
						<h2 in:fade >Will you be able to accept?</h2>
						<div in:fade class="attending-dialogue">
							<input
								class="attending-dialogue-button"
								type="button"
								name="attending-yes"
								value="Graciously Accept"
								on:click={confirmAttendance}
							>

							<input
								class="attending-dialogue-button red"
								type="button"
								name="attending-no"
								value="Regrettably Decline"
								on:click={sendDecline}
							>
						</div>
				{/if}

				{#if retrieved && declined}
					<div class="declined-dialogue">
						<h2 in:fade={{duration: 200}}>Thank you, your RSVP has been submitted successfully!</h2>
					</div>
				{/if}

				{#if attending}
					<input
						class="input-field"
						type="email"
						name="email"
						placeholder="email"
						bind:value={email}
						in:fade={{duration:600}}
						on:change={e => validateEmail(e)}
						required
					/>
					<input
						class="input-field"
						type="text"
						name="phoneNumber"
						placeholder="phoneNumber"
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
								value: "chicken",
								bound: null,
							},
							{
								label: "Beef",
								value: "beef",
								bound: null,
							},
							{
								label: "Fish",
								value: "fish",
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
											value: "true",
											bound: null,
										},
										{
											label: "Bringing a Guest",
											value: "false",
											bound: null,
										}
									]}
								/>
							</div>
						</div>
					{/if}
					<input class="submit-button" type="submit" name="submit" value="Submit">
				{:else if !retrieved}
					<input id="find-invitation-button" class="submit-button" type="button" on:click={getRsvp} name="submit"
								 value="Find Invitation">
				{/if}

				{#if errorMessage}
					<div in:fade class="error-message">{errorMessage}</div>
				{/if}
			</form>
		</div>
	</div>
</section>

<style>
    section {
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

    .form-container-mask {
        width: 100%;
        display: flex;
        justify-content: center;
        overflow: hidden;
        transition: height 800ms ease;
    }

    .form-container {
        padding: 20px;
        display: flex;
        flex-direction: column;
        justify-content: space-around;
        align-items: center;
        border-radius: 5px;
        background: #000000;
        width: 60%;

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

    .attending-dialogue-button {
        margin-top: 10px;
        border: none;
        border-radius: 5px;
        padding: 10px;
        background: rgb(0, 81, 0);
        background: linear-gradient(209deg, rgb(0, 81, 0) 50%, rgb(0, 53, 0) 90%);
    }

    .red {
        background: rgb(143, 7, 7);
        background: linear-gradient(209deg, rgba(143, 7, 7, 1) 50%, rgb(108, 4, 4) 90%);
    }

    .submit-button {
        margin-top: 10px;
        border: none;
        background: #cdcdcd;
        border-radius: 5px;
        padding: 10px;
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