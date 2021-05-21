const server = 'https://jsonplaceholder.typicode.com/posts';

const sendData = (data, callBack, falseCallBack) => {
  const request = new XMLHttpRequest();
  request.open('POST', server);

  request.addEventListener('readystatechange', () => {
    if (request.readyState !== 4) return;
    if (request.status === 200 || request.status === 201) {
      const response = JSON.parse(request.responseText);
      callBack(response.id);
    } else {
      falseCallBack(request.statusText);
      throw new Error(request.status);
    }
  });

  request.send(data);
};

const formElems = document.querySelectorAll('.form');
const notificationElem = document.createElement('notification');
const formBtn = document.querySelector('.form__button');

const notifySend = form => {
  formBtn.disabled = true;
  form.append(notificationElem);
  setTimeout(() => {
    notificationElem.remove();
    formBtn.disabled = false;
  }, 5000);
};

const formHandler = form => {
  form.addEventListener('submit', e => {
    e.preventDefault();
    const data = {};

    for (const { name, value } of form.elements) {
      if (name) {
        data[name] = value;
      }
    }

    if (data.name && (data.phone || data.mail)) {
      sendData(
        JSON.stringify(data),
        id => {
          notificationElem.textContent = `Ваша заявка № ${id} принята!
В ближайшее время с Вами свяжемся!`;
          notificationElem.style.color = 'green';
          notifySend(form);
        },
        () => {
          notificationElem.textContent =
            'Произошла ошибка сервера, попробуйте еще раз позже!';
          notificationElem.style.color = 'red';
          notifySend(form);
        },
      );
      form.reset();
    } else {
      notificationElem.textContent = 'Введите Ваши контактные данные';
      notificationElem.style.color = 'red';
      form.append(notificationElem);
      setTimeout(() => {
        notificationElem.remove();
      }, 5000);
    }
  });
};

formElems.forEach(formHandler);