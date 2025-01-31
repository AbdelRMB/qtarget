let targetData = null;

const updateEye = state => {
  if (state) {
    $('.target-eye').hide();
    let tHandClass = 'target-hand';

    if (targetData && targetData.length === 1 && targetData[0].icon) {
      tHandClass += ` ${targetData[0].icon} fa-fw fa-pull-left`;
    } else {
      tHandClass += ' fa-solid fa-hand fa-fw fa-pull-left';
    }

    $('.target-hand')
      .attr('class', tHandClass)
      .show();
  } else {
    $('.target-hand').hide();
    $('.target-eye').show();

    $('.target-interaction').html('');
    $('.target-label').html('');
  }
}

const showUi = state => {
  if (state) {
    updateEye(false);
    $('.target-wrapper').show();
  } else {
    $('.target-wrapper').hide();
  }
}

window.addEventListener('message', function (event) {
  const item = event.data;

  if (item.response == 'openTarget') {
      showUi(true);
  } else if (item.response == 'closeTarget') {
      showUi(false);
  } else if (item.response == 'validTarget') {
      targetData = item.data;
      $('.target-interaction').html(targetData.length === 1 ? targetData[0].label : 'Intéragir');
      updateEye(true);
  } else if (item.response == 'clickTarget') {
      if (targetData.length === 1) {
          postData(`selectTarget`, { id: 1 }).then(data => {
              if (data.status == 'success') {
                  showUi(false);
              }
          });
      } else {
          $('.target-label').html('');

          for (let [index, itemData] of Object.entries(targetData)) {
              if (itemData !== null) {
                  index = Number(index) + 1;

                  $('.target-label').append(
                      `<div class='target-item' id='${index}'><i class='${itemData.icon} fa-fw fa-pull-left target-icon'></i>${itemData.label}</div>`
                  );

                  $(`#${index}`).css('padding-top', '0.75vh');
              }
          }

          updateEye(true);
      }
  } else if (item.response == 'leftTarget') {
      updateEye(false);
  }
});


const doc = $(document);

doc.on('mousedown', (event) => {
  switch (event.which) {
      case 1: { 
          const id = event.target.id; 

          if (id) {
              window.postMessage({action: "selectTarget", id: id});
          } else {
              window.postMessage({action: "leftTarget"});
          }

          showUi(false);
          break;
      }
      case 3: { // Clic droit
          window.postMessage({action: "leftTarget"});
          showUi(false);
          break;
      }
  }
});


doc.on('keydown', (event) => {
  switch (event.key) {
    case 'Escape':
    case 'Backspace': {
      window.postMessage({action: "leftTarget"})
      showUi(false);
    }
  }
});

doc.on('mouseover', (event) => {
  const element = event.target;

  if (element.id) $(`#${element.id}`).css('color', 'rgb(242, 46, 82)');
});

doc.on('mouseout', (event) => {
  const element = event.target;

  if (element.id) $(`#${element.id}`).css('color', 'white');
});

async function postData(event = '', data = {}) {
  const response = await fetch(`https://${GetParentResourceName()}/${event}`, {
    method: 'POST', // *GET, POST, PUT, DELETE, etc.
    mode: 'cors', // no-cors, *cors, same-origin
    cache: 'no-cache', // *default, no-cache, reload, force-cache, only-if-cached
    credentials: 'same-origin', // include, *same-origin, omit
    headers: {
      'Content-Type': 'application/json'
    },
    redirect: 'follow',
    referrerPolicy: 'no-referrer',
    body: JSON.stringify(data)
  });
  return response.json();
}
