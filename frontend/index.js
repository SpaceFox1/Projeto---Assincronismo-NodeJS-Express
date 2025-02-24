const cardContainer = document.getElementById('matches');
const modal = document.getElementById('matchModal');
const modalTitle = document.getElementById('modalTitle');
const modalMainActionButtonLabel = document.getElementById('modalMainActionButtonLabel');
const modalMainActionButton = document.getElementById('submitModalFormButton');
const modalInputs = {
  name: document.getElementById('matchTitleInput'),
  address: document.getElementById('matchAddressInput'),
  date: document.getElementById('matchDateInput'),
}

const backendURL = 'http://localhost:3000';

// function to be runned when the main button on the modal is pressed
let mainModalActionToRun = null;

/*
const data = fetch(`${backendURL}/api/matches`, {
    method: 'get',
    body: JSON.stringify({
      id: '827501a8-2e0d-4acd-9f55-ccaafda2a013',
      // name: 'Banana',
      // description: 'teste 2',
      // picture: 'https://examplo.com'
    }),
    headers: {
      'Content-Type': 'application/json; charset=utf-8',
    }
  });
*/

async function deleteMatch(matchData) {
  return new Promise((resolve, reject) => {
    fetch(`${backendURL}/api/deleteMatch`, {
      method: 'delete',
      body: JSON.stringify({
        id: matchData.id,
      }),
      headers: {
        'Content-Type': 'application/json; charset=utf-8',
      }
    }).then((req) => {
      if (req.status < 400)return resolve();
      else reject(req.text);
    });
  })
}

function validateForm() {
  let isValid = true;
  if (!modalInputs.date.value || new Date(modalInputs.date.value) < new Date(modalInputs.date.min)) isValid = false;
  if (!modalInputs.name.value) isValid = false;
  if (!modalInputs.address.value) isValid = false;
  modalMainActionButton.disabled = !isValid;
}

// lock modal button when form is invalid
modalInputs.date.addEventListener('input', validateForm);
modalInputs.address.addEventListener('input', validateForm);
modalInputs.name.addEventListener('input', validateForm);

function openModal(modalTitleTxt, modalActionName) {
  document.body.style.overflowY = 'hidden';
  modal.style.display = 'flex';
  modalTitle.innerText = modalTitleTxt;
  modalMainActionButtonLabel.innerText = modalActionName;
  modalInputs.date.min = new Date().toUTCString();
}

function createUIMatch(matchObject) {
  // card box
  const card = document.createElement('div');
  card.classList.add('matchCard');
  card.classList.add('loading');
  card.classList.toggle('confirmed', matchObject.confirmed);

  // image box
  const imageContainer = document.createElement('div');
  imageContainer.classList.add('cardImageContainer');

  // image
  const img = document.createElement('img');
  imageContainer.appendChild(img);

  const imgSpinner = document.createElement('div');
  imgSpinner.classList.add('spinner');
  imageContainer.appendChild(imgSpinner);

  // add image box to card box
  card.appendChild(imageContainer);

  // content box
  const contentContainer = document.createElement('div');
  contentContainer.classList.add('cardContent');

  // title
  const title = document.createElement('h3');
  title.classList.add('cardTitle');
  title.innerText = matchObject.title;
  contentContainer.appendChild(title);

  // Date
  const DateText = document.createElement('p');
  DateText.classList.add('cardDate');
  DateText.innerText = new Date(matchObject.date).toLocaleString("pt-BR", {
    timeZone: 'America/recife',
    dateStyle: 'full',
    timeStyle: 'long'
  });
  contentContainer.appendChild(DateText);

  // Address
  const Address = document.createElement('p');
  Address.classList.add('cardDescription');
  Address.innerText = matchObject.address;
  contentContainer.appendChild(Address);

  // guestList
  const guestList = document.createElement('div');
  guestList.classList.add('guestList');

  // guestListTitle
  const guestListTitle = document.createElement('h3');
  guestListTitle.classList.add('sectionTitle');
  guestListTitle.innerText = 'Convidados';
  guestList.appendChild(guestListTitle);

  // guestListPeople
  function CreateGuestPerson(guestObject) {
    const guestBox = document.createElement('div');
    guestBox.classList.add('guestPerson');
    guestBox.classList.toggle('confirmed', guestObject.confirmed);

    // name
    const guestName = document.createElement('h4');
    guestName.classList.add('sectionTitle');
    guestName.innerText = guestObject.name;
    guestBox.appendChild(guestName);

    // phone
    const guestPhone = document.createElement('span');
    guestPhone.innerText = guestObject.phone;
    guestBox.appendChild(guestPhone);

    // confirm button
    const guestConfirmButton = document.createElement('button');
    guestConfirmButton.classList.add('cardButton');
    guestConfirmButton.innerText = guestObject.confirmed ? 'Desconfirmar' : 'Confirmar';
    guestConfirmButton.onclick = () => {
      guestObject.confirmed = !guestObject.confirmed;
      fetch(`${backendURL}/api/editMatch`, {
        method: 'PATCH',
        body: JSON.stringify({
          id: matchObject.id,
          guests: matchObject.guests,
        }),
        headers: {
          'Content-Type': 'application/json; charset=utf-8',
        }
      }).then((data) => data.json()).then((data) => {
        guestBox.classList.toggle('confirmed', guestObject.confirmed);
        guestConfirmButton.innerText = guestObject.confirmed ? 'Desconfirmar' : 'Confirmar';
      }).catch((err) => {
        reject(err);
      });
    }
    guestBox.appendChild(guestConfirmButton);

    // Remove button
    const guestRemoveButton = document.createElement('button');
    guestRemoveButton.classList.add('cardButton');
    guestRemoveButton.innerText = 'Excluir';
    guestRemoveButton.onclick = () => {
      matchObject.guests.splice(matchObject.guests.indexOf(guestObject), 1);
      fetch(`${backendURL}/api/editMatch`, {
        method: 'PATCH',
        body: JSON.stringify({
          id: matchObject.id,
          guests: matchObject.guests,
        }),
        headers: {
          'Content-Type': 'application/json; charset=utf-8',
        }
      }).then((data) => data.json()).then((data) => {
        guestBox.remove();
      }).catch((err) => {
        reject(err);
      });
    }
    guestBox.appendChild(guestRemoveButton);

    guestList.appendChild(guestBox);
  }
  console.log(matchObject);
  matchObject.guests.forEach((data) => CreateGuestPerson(data));

  // guestListNewPerson
  const guestListNew = document.createElement('div');
  guestListNew.classList.add('guestListNewBox');

  // guestList new Person name input
  const guestListNewNameInput = document.createElement('input');
  guestListNewNameInput.classList.add('guestListInput');
  guestListNewNameInput.placeholder = 'Nome';
  guestListNew.appendChild(guestListNewNameInput);

  // guestList new Person phone input
  const guestListNewPhoneInput = document.createElement('input');
  guestListNewPhoneInput.classList.add('guestListInput');
  guestListNewPhoneInput.placeholder = 'Telefone';
  guestListNew.appendChild(guestListNewPhoneInput);

  // guestList new Person add button
  const guestListNewAddButton = document.createElement('button');
  guestListNewAddButton.classList.add('cardButton');
  guestListNewAddButton.innerText = '+';
  guestListNewAddButton.disabled = true;
  guestListNewAddButton.onclick = () => {
    matchObject.guests.push({
      name: guestListNewNameInput.value,
      phone: guestListNewPhoneInput.value,
      confirmed: false,
    });
    fetch(`${backendURL}/api/editMatch`, {
      method: 'PATCH',
      body: JSON.stringify({
        id: matchObject.id,
        guests: matchObject.guests,
      }),
      headers: {
        'Content-Type': 'application/json; charset=utf-8',
      }
    }).then((data) => data.json()).then((data) => {
      CreateGuestPerson(matchObject.guests[matchObject.guests.length - 1]);
      guestListNewNameInput.value = '';
      guestListNewPhoneInput.value = '';
      checkGuestInputStatus();
    }).catch((err) => {
      reject(err);
    });
  }
  guestListNew.appendChild(guestListNewAddButton);

  function checkGuestInputStatus() {
    let isValid = true;
    if (!guestListNewNameInput.value) isValid = false;
    if (!guestListNewPhoneInput.value) isValid = false;
    guestListNewAddButton.disabled = !isValid;
  }
  guestListNewNameInput.addEventListener('input', checkGuestInputStatus);
  guestListNewPhoneInput.addEventListener('input', checkGuestInputStatus);

  // add guest list new box to guestList box
  guestList.appendChild(guestListNew)

  // add guest list box to card box
  contentContainer.appendChild(guestList);

  // add content box to card box
  card.appendChild(contentContainer);

  // buttons box
  const buttonsContainer = document.createElement('div');
  buttonsContainer.classList.add('cardButtonsContainer');

  // delete button
  const deleteButton = document.createElement('button');
  deleteButton.classList.add('cardButton');
  deleteButton.onclick = async () => {
    deleteButton.classList.add('loading');
    deleteMatch(matchObject).then(() => {
      card.remove();
    }).catch((err) => {
      console.error(err);
    });
  }
  // delete button spinner
  const deleteButtonSpinner = document.createElement('div');
  deleteButtonSpinner.classList.add('spinner');
  deleteButton.appendChild(deleteButtonSpinner);
  
  // delete button text
  const deleteButtonText = document.createElement('span');
  deleteButtonText.innerText = 'Deletar';
  deleteButton.appendChild(deleteButtonText);
  
  // add delete button to buttons box
  buttonsContainer.appendChild(deleteButton);

  card.appendChild(buttonsContainer);

  cardContainer.appendChild(card);

  fetch('http://localhost:3000/assets/jogadores.jpg').then((data) => data.blob()).then((imageBlob) => {
    img.src = URL.createObjectURL(imageBlob);
    card.classList.remove('loading');
  });
}

function fetchMatches() {
  fetch(`${backendURL}/api/matches`).then(data => data.json()).then((matches) => {
    matches.forEach((element) => {
      createUIMatch(element);
    });
  });
}

function startCreatingNewMatch() {
  openModal('Criar Partida de Futebol', 'Criar');
  mainModalActionToRun = async () => {
    return new Promise((resolve, reject) => {
      fetch(`${backendURL}/api/newMatch`, {
        method: 'put',
        body: JSON.stringify({
          name: modalInputs.name.value,
          address: modalInputs.address.value,
          date: new Date(modalInputs.date.value).toUTCString(),
        }),
        headers: {
          'Content-Type': 'application/json; charset=utf-8',
        }
      }).then((data) => data.json()).then((data) => {
        createUIMatch(data);
        resolve();
      }).catch((err) => {
        reject(err);
      });
    });
  };
}

function cancelModal() {
  document.body.style.overflowY = 'auto';
  modal.style.display = 'none';
  modalInputs.name.value = '';
  modalInputs.picture.value = '';
  modalInputs.description.value = '';
  modalMainActionButton.classList.remove('loading');
  mainModalActionToRun = null;
}

function modalMainAction() {
  modalMainActionButton.classList.add('loading');
  if (mainModalActionToRun) {
    mainModalActionToRun().then(() => {
      cancelModal();
    });
  }
}

fetchMatches();