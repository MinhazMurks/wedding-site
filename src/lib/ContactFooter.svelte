<script lang="ts">
	import { fade } from "svelte/transition";
	import { InputType } from "$lib/types/Events";
	import { PUBLIC_WEDDING_SERVICE_HOST } from "$env/static/public";
	import { ErrorResponse } from "$lib/types/Responses";
	import { gsap } from "gsap";
	import { tick } from "svelte";

	const usNumberFormat = [2, 5];

	let loadingContact = false;
	let sent = false;
	let errorMessage: string | null = null;
	let errorMessages: string[] | null = null;

	let firstName = "";
	let lastName = "";
	let phoneNumber = "";
	let phoneNumberVisual = "";
	let email = "";
	let message = "";

	let footer: HTMLElement;

	function submit() {
		loadingContact = true;
		fetch(`${PUBLIC_WEDDING_SERVICE_HOST}/api/v1/contact`, {
			method: "POST",
			headers: {
				"Content-Type": "application/json",
			},
			body: JSON.stringify({
				attending: true,
				firstName: firstName,
				lastName: lastName,
				phoneNumber: phoneNumber,
				email: email,
				message: message,
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
				const footerHeight = footer.offsetHeight;
				loadingContact = false;
				errorMessage = null;
				errorMessages = null;
				sent = true;

				await tick();
				updateHeightManually(footerHeight);
			})
			.catch(async error => {
				const footerHeight = footer.offsetHeight;
				loadingContact = false;


				if (error.message) {
					errorMessage = error.message;
				} else if (error.messages) {
					errorMessages = error.messages;
				}

				await tick();
				updateHeightManually(footerHeight);
			});
	}

	function updateHeightManually(oldHeight: number) {
		const timeline = gsap.timeline();

		timeline.set(
			footer,
			{
				height: oldHeight,
			},
		).to(footer,
			{
				height: "auto",
			});
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

	function validatePhoneNumberPasteInput(event: Event) {
		event.preventDefault();
		const pastedData = (event as ClipboardEvent).clipboardData?.getData("text");

		if (pastedData) {
			phoneNumber += pastedData.replace(/\D/g, "");
			phoneNumber = phoneNumber.substring(0, 10);
			convertPhoneNumberInput();
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
</script>

<footer bind:this={footer}>
	<form action="" class="contact-form-fields" class:loadingContact on:submit|preventDefault={submit}>
		{#if loadingContact}
			<div transition:fade={{duration: 100}} class="lds-heart">
				<div></div>
			</div>
		{/if}
		{#if !sent}
			<h1>Contact us</h1>
			<div class="group-container">
				<input
					class="contact-input-field"
					type="text"
					name="firstName"
					placeholder="First Name"
					in:fade={{duration:200}}
					bind:value={firstName}
					required
				/>
				<input
					class="contact-input-field"
					type="text"
					name="lastName"
					placeholder="Last Name"
					in:fade={{duration:200}}
					bind:value={lastName}
					required
				/>
			</div>
			<div class="group-container">
				<input
					class="contact-input-field"
					type="email"
					name="email"
					placeholder="Email"
					bind:value={email}
					in:fade={{duration:600}}
					required
				/>
				<input
					class="contact-input-field"
					type="text"
					name="phoneNumber"
					placeholder="Phone Number"
					value={phoneNumberVisual}
					in:fade={{duration:800}}
					on:input={e => validateNumberInput(e)}
					on:paste={e => validatePhoneNumberPasteInput(e)}
					required
				/>
			</div>
			<div class="group-container">
			<textarea
				class="contact-input-field context-text-area"
				name="message"
				placeholder="A message you want us to see"
				in:fade={{duration:800}}
				bind:value={message}
				required
			/>
			</div>

			<input class="contact-submit-button" type="submit" name="send" value="Send">
		{:else}
			<h1>Your message has been sent!</h1>
		{/if}

		{#if errorMessage}
			<div in:fade class="contact-error-message">{errorMessage}</div>
		{:else if errorMessages}
			{#each errorMessages as message}
				<div in:fade class="contact-error-message">{message}</div>
			{/each}
		{/if}
	</form>
</footer>

<style>
    footer {
        display: flex;
        justify-content: center;
        align-items: center;

        width: 100vw;
        background: black;
    }

    .contact-form-fields {
        display: flex;
        flex-direction: column;
        justify-content: center;
        align-items: center;

        padding: 20px;
        row-gap: 5px;
        z-index: 150;
        margin-bottom: 4vh;
    }

    .loadingContact {
        opacity: 0.8;
        cursor: default;
        pointer-events: none;
    }

    .group-container {
        display: flex;
        flex-direction: row;
        justify-content: center;
        align-items: center;
        column-gap: 5px;
        width: 100%
    }

    .contact-input-field {
        box-sizing: border-box;
        border: none;
        background: #dfdfdf;
        height: var(--input-height);
        padding: 10px;
        border-radius: 5px;
        width: 100%;
    }

    .context-text-area {
        font-family: Jost, serif;
        font-size: var(--font-size);
        width: 100%;
    }

    .contact-input-field::placeholder {
        color: #595959;
    }

    .contact-input-field:focus {
        color: black;
        border: none;
        outline: none;
    }

    .contact-submit-button {
        z-index: 100;
        margin-top: 10px;
        border: none;
        background: #cdcdcd;
        border-radius: 5px;
        padding: 10px;
    }

    .contact-submit-button:hover {
        cursor: pointer;
        transform: scale(1.05);
        transition: 100ms;
    }

    .contact-error-message {
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
	Loading Animation
	*/

    .lds-heart {
        z-index: 200;
        display: inline-block;
        position: absolute;
        width: 80px;
        height: 80px;
        transform: rotate(45deg);
        transform-origin: 40px 40px;
    }

    .lds-heart div {
        top: 24px;
        left: 24px;
        position: absolute;
        width: max(2vw, 4vh);
        height: max(2vw, 4vh);
        background: #fff;
        animation: lds-heart 1.2s infinite cubic-bezier(0.215, 0.61, 0.355, 1);
    }

    .lds-heart div:after,
    .lds-heart div:before {
        content: " ";
        position: absolute;
        display: block;
        width: max(2vw, 4vh);
        height: max(2vw, 4vh);
        background: #fff;
    }

    .lds-heart div:before {
        left: min(-1vw, -2.5vh);
        border-radius: 50% 0 0 50%;
    }

    .lds-heart div:after {
        top: min(-1vw, -2.5vh);
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