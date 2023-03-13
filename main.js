'use strict'
// render comments
function commentsRender() {
  const arrayComments = localStorage.getItem('comments')
    ? JSON.parse(localStorage.getItem('comments')) : [];
  const commentsWrap = document.querySelector('.commentsS__wrap');
  if (commentsWrap) {
    if (arrayComments.length === 0) {
      commentsWrap.innerHTML = '<span class="commentsS__not-comments">Пока комментариев нет</span>';
    } else {
      commentsWrap.innerHTML = '';
    }
    arrayComments.forEach(({ name, text, id, like, date, time } = i) => {
      let item = document.createElement('div');
      item.classList.add('commentsS__item');
      item.insertAdjacentHTML('afterbegin', `
          <div data-id="${id}" class="comment  ${likes()[1]}">
          <div class="comment__header">
            <div class="comment__name">${name}</div>
            <div class="comment__icons">
              <button class="comment__like comment__icon">
                <img class="comment__like-img" src=${likes()[0]} alt="heart">
              </button>
              <button class="comment__remove comment__icon">
                <img class="comment__trash-img" src="img/trash1.svg" alt="trash">
              </button>
            </div>
          </div>
          <div class="comment__text">${text}</div>
          <div class="comment__time">
            <span class="comment__date">${formatDate()}</span>
            <span>в ${time}</span>
          </div>
        </div>
      `)

      // date ()
      function formatDate() {
        const todayDate = new Date();
        const useDate = new Date(date);
        const optionsDate = {
          year: 'numeric',
          month: 'short',
          day: 'numeric',
        };
        const nowDate = new Intl.DateTimeFormat('ru', optionsDate).format(useDate);
        const today = new Intl.DateTimeFormat('ru', optionsDate).format(todayDate);

        if (useDate.getFullYear() == todayDate.getFullYear()
          && useDate.getMonth() == todayDate.getMonth() &&
          useDate.getDate() == todayDate.getDate() - 1) {
          return 'вчера';
        } else if (nowDate == today) {
          return 'сегодня';
        } else {
          return nowDate;
        }
      }

      // like
      function likes() {
        if (like) {
          return ['img/heart2com.svg', '_like'];
        } else {
          return ['img/heart1com.svg', ''];
        }
      }

      commentsWrap.append(item);
    })
  };
};
commentsRender();

// add last comments
function addLastComment() {
  const commentsWrap = document.querySelector('.commentsS__wrap');
  if (commentsWrap) {
    const lastComments = JSON.parse(localStorage.getItem('comments')).at(-1);
    let { name, text, id, like, date, time } = lastComments;
    let item = document.createElement('div');
    item.classList.add('commentsS__item');
    item.insertAdjacentHTML('afterbegin', `
          <div data-id="${id}" class="comment  ${likes()[1]}">
          <div class="comment__header">
            <div class="comment__name">${name}</div>
            <div class="comment__icons">
              <button class="comment__like comment__icon">
                <img class="comment__like-img" src=${likes()[0]} alt="heart">
              </button>
              <button class="comment__remove comment__icon">
                <img class="comment__trash-img" src="img/trash1.svg" alt="trash">
              </button>
            </div>
          </div>
          <div class="comment__text">${text}</div>
          <div class="comment__time">
            <span class="comment__date">${formatDate()}</span>
            <span>в ${time}</span>
          </div>
        </div>
      `);
    // date ()
    function formatDate() {
      const todayDate = new Date();
      const useDate = new Date(date);
      const optionsDate = {
        year: 'numeric',
        month: 'short',
        day: 'numeric',
      };
      const nowDate = new Intl.DateTimeFormat('ru', optionsDate).format(useDate);
      const today = new Intl.DateTimeFormat('ru', optionsDate).format(todayDate);

      if (useDate.getFullYear() == todayDate.getFullYear()
        && useDate.getMonth() == todayDate.getMonth() &&
        useDate.getDate() == todayDate.getDate() - 1) {
        return 'вчера';
      } else if (nowDate == today) {
        return 'сегодня';
      } else {
        return nowDate;
      }
    }
    // like
    function likes() {
      if (like) {
        return ['img/heart2com.svg', '_like'];
      } else {
        return ['img/heart1com.svg', ''];
      }
    }
    commentsWrap.append(item);
  };
};

// add new comment (form)
function addNewComment() {
  const form = document.getElementById('formComment');
  if (form) {
    const useName = document.getElementById('name');
    const useText = document.getElementById('comment');
    const useDate = document.getElementById('date');

    [useName, useText].forEach(i => {
      i.addEventListener('input', function () {
        if (i.classList.contains('war')) {
          i.nextElementSibling.style.visibility = "hidden";
          i.classList.remove('war');
        };
      });
    });

    function addCom() {
      const arrCom = localStorage.getItem('comments')
        ? JSON.parse(localStorage.getItem('comments')) : [];
      const countId = arrCom.length > 0 ?
        +arrCom[arrCom.length - 1].id + 1 : 1;
      const newDate = new Date();
      if (arrCom.length === 0) {
        document.querySelector('.commentsS__wrap').innerHTML = '';
      }
      // // time (hours and minutes)
      const optionsTime = {
        hour: 'numeric',
        minute: 'numeric',
        hour12: false,
      };
      const time = new Intl.DateTimeFormat('ru', optionsTime).format(newDate);
      // date
      let date;
      if (!useDate.value) {
        date = `${newDate.getFullYear()}-${(newDate.getMonth() + 1)}-${newDate.getDate()}`;
      } else {
        date = useDate.value
      };

      let newCom = {
        id: `${countId}`,
        name: useName.value.trim(),
        text: useText.value.trim(),
        like: false,
        date,
        time,
      };

      // push local storage
      arrCom.push(newCom);
      localStorage.setItem('comments', JSON.stringify(arrCom));
      useName.value = '';
      useText.value = '';
      useDate.value = '';
    };

    form.addEventListener('submit', function (e) {
      e.preventDefault();
      [useName, useText].forEach(i => {
        if (!i.value.trim()) {
          i.nextElementSibling.style.visibility = "visible";
          i.classList.add('war');
        };
      });

      if (!useName.classList.contains('war') && !useText.classList.contains('war')) {
        addCom();
        addLastComment();
      }
    })
  }
};
addNewComment();

// like and remove comment
function commentLikeRemove() {
  const comWrap = document.querySelector('.commentsS__wrap');
  if (comWrap) {
    comWrap.addEventListener('click', function (e) {
      // click on like
      if (e.target.classList.contains('comment__like-img')) {
        let arrCom = JSON.parse(localStorage.getItem('comments'));
        arrCom.map(i => {
          if (i.id == e.target.closest('[data-id]').dataset.id) {
            i.like = !i.like;
          }
        });
        localStorage.setItem('comments', JSON.stringify(arrCom));
        if (e.target.getAttribute('src') == 'img/heart1com.svg') {
          e.target.closest('[data-id]').classList.add('_like')
          e.target.setAttribute('src', 'img/heart2com.svg');
        } else {
          e.target.closest('[data-id]').classList.remove('_like')
          e.target.setAttribute('src', 'img/heart1com.svg');
        }
      }

      // click on trash (delete comment)
      if (e.target.classList.contains('comment__trash-img')) {
        e.target.closest('[data-id]').parentElement.remove();
        let arrCom = JSON.parse(localStorage.getItem('comments'));
        let indexCom = arrCom.findIndex(i => i.id == e.target.closest('[data-id]').dataset.id);
        arrCom.splice(indexCom, 1);
        localStorage.setItem('comments', JSON.stringify(arrCom));
        if (arrCom.length === 0) {
          document.querySelector('.commentsS__wrap').innerHTML = '<span class="commentsS__not-comments">Пока комментариев нет</span>';
        }
      }
    })
  }
} commentLikeRemove();




