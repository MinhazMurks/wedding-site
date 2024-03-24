<script lang="ts">
	import { afterUpdate, beforeUpdate, onMount } from 'svelte';
	import js from 'jquery'

	let sizeAnimationCallback: () => void;

	let oldHeight: number;

	onMount(() => {
		window.js = js;

		const contentMask = js("form-container-mask")
		const contentBoxId = '#form-container';

		const currentHeight = js(contentBoxId).height();
		const formContainerMaskHeight = js("#form-container-mask").height();
		const formContainerHeight = js("#form-container").height();
		console.log("formContainerHeight", formContainerHeight);
		console.log("formContainerMaskHeight", formContainerMaskHeight);
		contentMask.width(50);

		contentMask.css("width", 50);

		sizeAnimationCallback = async () => {
			// wait for 1 second
			const contentMask = js("form-container-mask")
			const formContainerMaskHeight = js("#form-container-mask").height();
			const formContainerHeight = js("#form-container").height();
			console.log("formContainerHeight", formContainerHeight);
			console.log("formContainerMaskHeight", formContainerMaskHeight);

			js("#form-container-mask").height(formContainerHeight);
		}
	});

	beforeUpdate(() => {
		console.log("beforeUpdate");

		const contentMask = js("form-container-mask")
		const formContainerMaskHeight = js("#form-container-mask").height();
		const formContainerHeight = js("#form-container").height();
		oldHeight = formContainerMaskHeight || 0;
		//console.log("formContainerHeight", formContainerHeight);
		//console.log("formContainerMaskHeight", formContainerMaskHeight);
	})

	afterUpdate(() => {
		console.log("afterUpdate");
		const contentMask = js("form-container-mask")
		const formContainerMaskHeight = js("#form-container-mask").height();
		const formContainerHeight = js("#form-container").height();
		if (retrieved) {
			console.log("formContainerHeight", formContainerHeight);
			console.log("formContainerMaskHeight", formContainerMaskHeight);
			js("#form-container-mask").height(oldHeight);
			js("#form-container-mask").height(formContainerMaskHeight);
		}
	})

	enum InputType {
		INSERT = 'insertText',
		INSERT_FROM_PASTE = 'insertFromPaste',
		DELETE_BACKWARD = 'deleteContentBackward',
		DELETE_FORWARD = 'deleteContentForward',
	}

	type GetRsvpResponse = {
		firstName: string,
		lastName: string,
		plusOneEnabled: boolean
	}
	
	type ErrorResponse = {
		message: string,
	}

	const weddingServiceHost = "localhost:8080"

	const usNumberFormat = [2, 5];

	let retrieved = false;
	let loading = false;

	let firstName = '';
	let lastName = '';
	let email = '';
	let phoneNumber = '';
	let phoneNumberVisual = '';
	let foodSelected = false;

	let chickenSelected = false;
	let beefSelected = false;
	let fishSelected = false;

	let plusOneEnabled = false;
	let plusOneSelected = false;

	let errorMessage: string = null;
	//contentMask.css('height', currentHeight);

	function getRsvp() {
		loading = true;
		fetch(`http://${weddingServiceHost}/api/v1/rsvp?` + new URLSearchParams({
			firstName: firstName,
			lastName: lastName,
		}), {
			method: 'GET',
			headers: {
				"Content-Type": "application/json",
			}
		})
			.then(async response => {
				if (response.status >= 500) {
					throw new Error("Something went wrong");
				}
				else if (response.status >= 400) {
					const errorResponse = await response.json() as never as ErrorResponse;
					console.log(response);
					throw new Error(errorResponse.message)
				}
				return response.json();
			})
			.then(data => {
				data = data as GetRsvpResponse;

				firstName = data.firstName;
				lastName = data.lastName;
				plusOneEnabled = data.plusOneEnabled;

				loading = false;
				retrieved = true;
			})
			.catch(error =>
			{
				console.log("CAUGHT HERE " + error.message);
				loading = false;
				errorMessage = error.message;
			});
	}

	function submit() {
		console.log('Submitting...');
	}

	function validateFirstName(event: Event) {
		let inputEvent = event as InputEvent;
		firstName = inputEvent.target.value;
	}

	function validateLastName(event: Event) {
		let inputEvent = event as InputEvent;
		lastName = inputEvent.target.value;
	}

	function validateEmail(event: Event) {
		console.log('validateEmail', event);
	}

	function validateNumberInput(event: Event) {
		event.preventDefault();
		let inputEvent = event as InputEvent;
		let newCharacter = inputEvent.data;

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
				inputEvent.target.value = phoneNumberVisual;
				break;
			case InputType.DELETE_FORWARD:
			case InputType.DELETE_BACKWARD:
				if (inputEvent.target)
					phoneNumber = inputEvent.target.value.replace(/\D/g, '');
				convertPhoneNumberInput();
				break;
			default:
				inputEvent.target.value = phoneNumberVisual;
		}
	}

	function convertPhoneNumberInput() {
		phoneNumberVisual = '';
		for (let i = 0; i < phoneNumber.length; i++) {
			phoneNumberVisual += phoneNumber.charAt(i);
			if (usNumberFormat.includes(i) && i + 1 < phoneNumber.length) {
				phoneNumberVisual += '-';
			}
		}
	}

	function validatePhoneNumberPasteInput(event: Event) {
		event.preventDefault();
		const pastedData = (event as ClipboardEvent).clipboardData?.getData('text');

		if (pastedData) {
			phoneNumber += pastedData.replace(/\D/g, '');
			phoneNumber = phoneNumber.substring(0, 10);
			convertPhoneNumberInput();
		}
	}

	function foodSelectChangeInput() {
		foodSelected = !foodSelected;

		console.log(fishSelected);
	}
</script>

<section>
	<div id="form-container-mask" class="form-container-mask">
		<div id="form-container" class="form-container" class:loading>

			{#if loading}
				<div class="lds-heart"><div></div></div>
			{/if}

			<h1>RSVP</h1>
			<form class="form-fields" on:submit={submit}>
				<input
					class="input-field"
					type="text"
					name="firstName"
					placeholder="First Name"
					bind:value={firstName}
					on:input={e => validateFirstName(e)}
					required
				/>
				<input
					class="input-field"
					type="text"
					name="lastName"
					placeholder="Last Name"
					bind:value={lastName}
					on:input={e => validateLastName(e)}
					required
				/>

				{#if retrieved}
					<input
						class="input-field"
						type="email"
						name="email"
						placeholder="email"
						bind:value={email}
						on:change={e => validateEmail(e)}
						required
					/>
					<input
						class="input-field"
						type="text"
						name="phoneNumber"
						placeholder="phoneNumber"
						value={phoneNumberVisual}
						on:input={e => validateNumberInput(e)}
						on:paste={e => validatePhoneNumberPasteInput(e)}
						required
					/>
					<div class="food-selection">
						<label for="chickenBox">
							Chicken
							<input
								id="chickenBox"
								type="checkbox"
								on:change={foodSelectChangeInput}
								bind:checked={chickenSelected}
								disabled="{!chickenSelected && foodSelected}"
							>
						</label>
						<label for="beefBox">
							Beef
							<input
								id="beefBox"
								type="checkbox"
								class=""
								on:change={foodSelectChangeInput}
								bind:checked={beefSelected}
								disabled="{!beefSelected && foodSelected}"
							>
						</label>

						<label for="fishBox">
							Fish
							<input
								id="fishBox"
								type="checkbox"
								on:change={foodSelectChangeInput}
								bind:checked={fishSelected}
								disabled="{!fishSelected && foodSelected}"
								required
							>
						</label>
					</div>
					<input class="submit-button" type="submit" name="submit" value="Submit">
				{:else}
					<input id="find-invitation-button" class="submit-button" type="button" on:click={getRsvp} name="submit" value="Find Invitation">
				{/if}

				{#if errorMessage}
					<div class="error-message">{errorMessage}</div>
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
    }

    h1 {
        font-size: max(8vw, 10vh);
        margin-top: 2rem;
        margin-bottom: 2rem;
    }

		.loading {
				opacity: 0.8;
				cursor: default;
				pointer-events: none;
		}

    .input-field {
        border: none;
        background: #dfdfdf;
        padding: 10px;
        border-radius: 5px;
        width: 60%;
    }

		.input-field::placeholder {
        color: #595959;
		}

    .input-field:focus {
        color: black;
        border: none;
        outline: none;
    }

		.form-container-mask {
        margin: 10px;
				width: 100%;
				display: flex;
				justify-content: center;
				overflow: hidden;
        transition: height 1s ease;
		}

    .form-container {
				padding: 10px;
        display: flex;
        flex-direction: column;
        justify-content: space-around;
        align-items: center;
        border-radius: 5px;
        background: #9c9c9c;
        width: 60%;
    }

    .form-fields {
        display: flex;
        flex-direction: column;
        align-items: center;
        row-gap: 5px;
        width: 100%;
    }

    .food-selection {
        display: flex;
        flex-direction: row;
        column-gap: 20px;
    }

    .submit-button {
        border: none;
        background: #cdcdcd;
        padding: 10px;
    }

		.error-message {
				background: #bf3737;
				color: white;
				border-radius: 5px;
				margin: 10px;
				padding-top: 10px;
				padding-bottom: 10px;
				padding-left: 50px;
				padding-right: 50px;

        box-shadow: 0px 0px 50px -8px rgba(0,0,0,0.75);
        -webkit-box-shadow: 0px 0px 50px -8px rgba(0,0,0,0.75);
        -moz-box-shadow: 0px 0px 50px -8px rgba(0,0,0,0.75);
		}


		/*
		Pop in animation
		*/

		.pop-in {
        animation-duration: 0.5s;
        animation-name: animate-fade;
        animation-delay: 0.5s;
        animation-fill-mode: backwards;
		}

    @keyframes animate-fade {
        0% { opacity: 0; }
        100% { opacity: 1; }
    }

    .test {
        animation-name: test;
        animation-duration: 1s;
        overflow: hidden;
        white-space: nowrap;
    }
    @keyframes test {
        0% {
            max-height: 0;
        }
        100% {
            max-height: 200px;
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