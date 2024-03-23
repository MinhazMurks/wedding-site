<script lang="ts">
	enum InputType {
		INSERT = 'insertText',
		INSERT_FROM_PASTE = 'insertFromPaste',
		DELETE_BACKWARD = 'deleteContentBackward',
		DELETE_FORWARD = 'deleteContentForward',
	}

	const weddingServiceHost = 

	const usNumberFormat = [2, 5];

	let retrieved = false;

	let firstName = '';
	let lastName = '';
	let email = '';
	let phoneNumber = '';
	let phoneNumberVisual = '';
	let foodSelected = false;

	let chickenSelected = false;
	let beefSelected = false;
	let fishSelected = false;

	function submit() {
		console.log('Submitting...');
	}

	function other() {
		console.log('Other...');
		retrieved = true;
	}

	function changeInput(event: Event) {
		let inputEvent = event as InputEvent;
		firstName = inputEvent.target.value;
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
	<div class="form-container">
		<h1>RSVP</h1>
		<form class="form-fields" on:submit={submit}>
			<input
				class="input-field"
				type="text"
				name="firstName"
				placeholder="firstName"
				bind:value={firstName}
				on:input={e => changeInput(e)}
				required
			/>
			<input
				class="input-field"
				type="text"
				name="lastName"
				placeholder="lastName"
				required
			/>

			{#if retrieved}
				<input
					class="input-field"
					type="email"
					name="email"
					placeholder="email"
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
				<input class="submit-button" type="button" on:click={other} name="submit" value="Find Invitation">
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
        font-size: 8rem;
        margin-top: 2rem;
        margin-bottom: 2rem;
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
</style>