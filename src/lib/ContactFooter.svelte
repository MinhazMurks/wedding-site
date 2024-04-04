<script lang="ts">
	import { fade } from "svelte/transition";
	import { InputType } from "$lib/types/Events";
	import { PUBLIC_WEDDING_SERVICE_HOST } from "$env/static/public";
	import { ErrorResponse } from "$lib/types/Responses";
	import { tick } from "svelte";

	const usNumberFormat = [2, 5];

	let loading = false;

	let firstName = "";
	let lastName = "";
	let phoneNumber = "";
	let phoneNumberVisual = "";
	let email = "";
	let message = "";

	function submit() {
		fetch(`${PUBLIC_WEDDING_SERVICE_HOST}/api/v1/contact?`, {
			method: "POST",
			headers: {
				"Content-Type": "application/json",
			},
			body: JSON.stringify({
				attending: true,
				firstName: firstName,
				lastName: lastName,
				email: email,
				message: message
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

			})
			.catch(async error => {
				const currentContainerMaskHeight = formContainerMask.offsetHeight;

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

<footer>
	<form action="" class="contact-form-fields">
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
		<input id="wtf" class="submit-button" type="button" name="send" value="Send" on:click={submit}>
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
</style>