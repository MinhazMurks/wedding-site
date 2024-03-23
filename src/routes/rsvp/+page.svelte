<script lang="ts">

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
	<div class="form-container" class:loading>

		{#if loading}
			<div class="lds-roller"><div></div><div></div><div></div><div></div><div></div><div></div><div></div><div></div></div>
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
				<input class="submit-button" type="button" on:click={getRsvp} name="submit" value="Find Invitation">
			{/if}

			{#if errorMessage}
				<div class="error-message">{errorMessage}</div>
			{/if}

		</form>
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
        background: #ffffff;
        padding: 10px;
        border-radius: 5px;
        width: 60%;
    }

    .input-field:focus {
        color: black;
        border: none;
        outline: none;
    }

    .form-container {
        display: flex;
        flex-direction: column;
        justify-content: space-around;
        align-items: center;
        padding: 10px;
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

    .lds-roller {
        display: inline-block;
        position: absolute;
        width: 80px;
        height: 80px;
    }
    .lds-roller div {
        animation: lds-roller 1.2s cubic-bezier(0.5, 0, 0.5, 1) infinite;
        transform-origin: 40px 40px;
    }
    .lds-roller div:after {
        content: " ";
        display: block;
        position: absolute;
        width: 7px;
        height: 7px;
        border-radius: 50%;
        background: #fff;
        margin: -4px 0 0 -4px;
    }
    .lds-roller div:nth-child(1) {
        animation-delay: -0.036s;
    }
    .lds-roller div:nth-child(1):after {
        top: 63px;
        left: 63px;
    }
    .lds-roller div:nth-child(2) {
        animation-delay: -0.072s;
    }
    .lds-roller div:nth-child(2):after {
        top: 68px;
        left: 56px;
    }
    .lds-roller div:nth-child(3) {
        animation-delay: -0.108s;
    }
    .lds-roller div:nth-child(3):after {
        top: 71px;
        left: 48px;
    }
    .lds-roller div:nth-child(4) {
        animation-delay: -0.144s;
    }
    .lds-roller div:nth-child(4):after {
        top: 72px;
        left: 40px;
    }
    .lds-roller div:nth-child(5) {
        animation-delay: -0.18s;
    }
    .lds-roller div:nth-child(5):after {
        top: 71px;
        left: 32px;
    }
    .lds-roller div:nth-child(6) {
        animation-delay: -0.216s;
    }
    .lds-roller div:nth-child(6):after {
        top: 68px;
        left: 24px;
    }
    .lds-roller div:nth-child(7) {
        animation-delay: -0.252s;
    }
    .lds-roller div:nth-child(7):after {
        top: 63px;
        left: 17px;
    }
    .lds-roller div:nth-child(8) {
        animation-delay: -0.288s;
    }
    .lds-roller div:nth-child(8):after {
        top: 56px;
        left: 12px;
    }
    @keyframes lds-roller {
        0% {
            transform: rotate(0deg);
        }
        100% {
            transform: rotate(360deg);
        }
    }

</style>