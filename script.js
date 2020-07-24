const dropdown = $(".dropdown");
const DATE_PICKER_OPTIONS = {
  dateFormat: "yy-mm-dd",
};
const start_date = $("#start-date");
const end_date = $("#end-date");
const sliderContainer = $("#slider-container");
const eventsList = $("#events-list");
const $mainSearchInput = $("#main-search");
const DEFAULT_END_DATE = "2022-12-30";

/**
 * shows the date in format DD-MM-YYY
 * @param {string} date
 */
function formatDate(date) {
  let d = new Date(date),
    month = "" + (d.getMonth() + 1),
    day = "" + d.getDate(),
    year = d.getFullYear();

  if (month.length < 2) month = "0" + month;
  if (day.length < 2) day = "0" + day;

  return [day, month, year].join("-");
}

//Dropdown Menu
dropdown.click(function () {
  $(this).attr("tabindex", 1).focus();
  $(this).toggleClass("active");
  $(this).find(".dropdown-menu").slideToggle(300);
});
dropdown.focusout(function () {
  $(this).removeClass("active");
  $(this).find(".dropdown-menu").slideUp(300);
});
$(".dropdown .dropdown-menu li").click(function () {
  $(this).parents(".dropdown").find("span").text($(this).text());
  $(this).parents(".dropdown").find("input").attr("value", $(this).attr("id"));
});

// datepicker
$(function () {
  start_date.datepicker(DATE_PICKER_OPTIONS);
});
$(function () {
  end_date.datepicker(DATE_PICKER_OPTIONS);
});

/**
 * shows modal if end date is leass than start date
 */
function showModal() {
  const $modal = $(`<div id="myModal" >
  <span class="close">&times;</span>
  <div class="modal-content">
  <p>End date can not be less than start date</p>
  </div>
</div>`);

  $modal.appendTo("body");
  $modal.show();
  $modal.find(".close").on("click", (e) => {
    $modal.detach();
  });
  end_date.val("");
}

// arrow up with scrolling to the top
$(window).scroll(function () {
  if ($(this).scrollTop() >= 50) {
    $("#return-to-top").fadeIn(200);
  } else {
    $("#return-to-top").fadeOut(200);
  }
});
$("#return-to-top").click(function () {
  $("body,html").animate(
    {
      scrollTop: 0,
    },
    500
  );
});

/**
 * show slides in a slider form with responsive design (@media)
 * @param {{*}} resp
 */
const showSlider = (resp) => {
  $.each(resp, (i, event) => {
    showSliderItems(event);
  });
  $("body,html").scrollTop(0);
  $(".responsive").slick({
    dots: true,
    prevArrow: $(".prev"),
    nextArrow: $(".next"),
    infinite: false,
    speed: 300,
    slidesToShow: 4,
    slidesToScroll: 1,
    infinite: true,
    dots: true,
    responsive: [
      {
        breakpoint: 1024,
        settings: {
          slidesToShow: 3,
          slidesToScroll: 1,
          infinite: true,
          dots: true,
        },
      },
      {
        breakpoint: 800,
        settings: {
          slidesToShow: 2,
          slidesToScroll: 1,
          infinite: true,
          dots: true,
        },
      },
      {
        breakpoint: 600,
        settings: {
          slidesToShow: 1,
          slidesToScroll: 1,
        },
      },
    ],
  });
};

/**
 * creates a set of sliders
 * @param {{*}} event
 */
function showSliderItems(event) {
  const $sliderItemContent = createSliderItem(event);
  $sliderItemContent.appendTo($(".responsive"));
}

/**
 * creates template of one slider
 * @param {{*}} event
 */
function createSliderItem(event) {
  let dataShow = event.date;
  const $sliderItem = $(`<div class="slider-item">
  <img class="slider-image" src=${event.picture} />
        <h3>${event.title}</h3>
    <div class="event-details">
    <p>${event.city}</p>
    <p><i class="far fa-calendar-alt"></i> ${formatDate(dataShow)} </p>
        </div>
</div>`);
  let path = sliderContainer;

  $sliderItem.find(".slider-image").on("click", () => showEvent(event, path));

  return $sliderItem;
}

/**
 * appends and shows short information about events in a list
 * @param {object} event
 */
function showAboutEvent(event) {
  const $aboutEvent = createAboutEvent(event);
  $aboutEvent.appendTo(eventsList);
}

/**
 * shows short information about event
 * @param {object} event
 */
function createAboutEvent(event) {
  const $aboutEvent = $(`
  <li>
  <div class="event-details">
  <img src="${event.picture}" alt="" />
      <h3 >${event.title}</h3>
    <p><i class="far fa-calendar-alt"> </i> ${event.date}</p>
    <p><i>Location: </i>${event.city}</p>
    <p>
      <i>Description: </i>${event.about.slice(0, 130)}
    </p>
      </div>
  <div class="btnn-left">
      <button class="btnn showfull" id="readMore">Read more</button>
    </div>
</li>`);

  const path = $("#events-container");
  $aboutEvent.find(".showfull").on("click", () => showEvent(event, path));

  path.show();
  return $aboutEvent;
}

/**
 * shows template with full information about events
 * @param {object, DOM element} event
 */
function showEvent(event, path) {
  $("body,html").scrollTop(0);
  const $fullEvent = $(`<div class="event-full">
        <img src="${event.picture}" />
        <div class="event-details">
          <h3>${event.title}</h3>
          <p><i class="far fa-calendar-alt"></i> ${event.date}</p>
          <p>Location: ${event.city}</p>
          <p>
            Description: ${event.about}
          </p>
          <hr />
          <div class="details-section">
            <div class="details">
              <h3>Details:</h3>
              <p>Hosted by: ${event.company}</p>
              <p>e-mail: ${event.email}</p>
              <p>phone: ${event.phone}</p>
              <p>contact person: ${event.contact_person}</p>
            </div>
            <div class="map">
            <iframe
              src=${event.map}
              frameborder="0"
              style="border: 0;"
              allowfullscreen=""
              aria-hidden="false"
              tabindex="0"
            ></iframe>  </div>
          </div>
          
          <div class="btnn-center">
            <button class="btnn" id="go-back">Go back</button>
          </div>
        </div>
      </div>`);

  $fullEvent.appendTo($(".event-container"));

  path.hide();
  $(".event-container").show();

  $fullEvent.find("#go-back").on("click", (e) => {
    path.show();
    $fullEvent.detach();
  });
}

/**
 * error template to inform if no response on search
 */
function onError() {
  const $errorMessage = $(
    `<li class="error"><div ><h3>No matching results</h3></div></li>`
  );
  $errorMessage.appendTo(eventsList);
}

/**
 * function to search by name
 * @param {*} e
 */
function onSearchClick(e) {
  let searchVal = $mainSearchInput.val().toLowerCase().trim();
  eventsList.empty();
  $(".event-container").empty();
  sliderContainer.hide();

  const onSuccess = (resp) => {
    if (!$.isArray(resp) || !resp.length) {
      onError();
    } else {
      $.each(resp, (i, event) => {
        showAboutEvent(event);
      });
    }
  };

  $.ajax({
    method: "GET",
    url: `http://localhost:3000/events?title_like=${searchVal}&_sort=date`,
    success: onSuccess,
  });
}

/**
 * function of search by filters
 * @param {*} e
 */
function onTotSearchClick(e) {
  let valueCity = $("#citySpan").text();
  if (valueCity == "select city") {
    valueCity = "";
  }
  $("#citySelect").val(valueCity);
  let cityVal = $("#citySelect").val();

  let valueCategory = $("#categorySpan").text();
  if (valueCategory == "select category") {
    valueCategory = "";
  }
  $("#categorySelect").val(valueCategory);
  let categoryVal = $("#categorySelect").val();

  let startDate = start_date.val();
  let endDate = end_date.val();
  if (!endDate) {
    endDate = DEFAULT_END_DATE;
  }
  if (Date.parse(startDate) > Date.parse(endDate)) {
    showModal();
    return;
  }

  eventsList.empty();
  sliderContainer.hide();
  $(".event-container").empty();

  const onSuccess = (resp) => {
    if (!$.isArray(resp) || !resp.length) {
      onError();
    } else {
      $.each(resp, (i, event) => {
        showAboutEvent(event);
      });
    }
  };

  $.ajax({
    method: "GET",
    url: `http://localhost:3000/events?city_like=${cityVal}&date_gte=${startDate}&date_lte=${endDate}&category_like=${categoryVal}`,
    success: onSuccess,
  });
}

/**
 * posts a new event with params to db.json
 * @param {{*}} data
 */
function addEvent(data) {
  $.ajax({
    type: "POST",
    url: "http://localhost:3000/events",
    data: data,
    success: showSlider,
  });
}

/**
 * creats template of adding new event
 */
function showModalAdd() {
  const $addEventForm = $(`<div id="exampleModal" tabindex="-1" role="dialog" aria-labelledby="exampleModalLabel" aria-hidden="true">
    <div class="modal-dialog modal-lg">
      <div class="modal-content">
        <div class="modal-header">
          <h5 class="modal-title" id="exampleModalLabel">Please fill in the information</h5>
          
          <button type="button" class="close closed" aria-label="Close">
            <span aria-hidden="true">&times;</span>
          </button>
        </div>
        <div class="modal-body">
        <p><b>Fields marked with <span>***</span> are required to fill in</b></p>
        <form>
        <div class="form-row">
        <div class="form-group col-md-6">
          <label for="title">Title of the event <span>***</span></label>
          <input type="text" class="form-control" id="title">
        </div>
        <div class="form-group col-md-4">
          <label for="date">Date of the event <span>***</span></label>
          <input type="text" class="form-control" id="date" placeholder="YYYY-MM-DD" >
        </div>
        </div>
        <div class="form-row">
        <div class="form-group col-md-4">
          <label for="city">Location</label>
          <select name="city" id="city" class="custom-select">
          <option value="Lviv">Lviv</option>
          <option value="Kherson">Kherson</option>
          </select>
        </div>
        <div class="form-group col-md-4">
          <label for="category">Category</label>
          <select name="category" id="category" class="custom-select">
          <option value="music">Music</option>
          <option value="tours">Tours</option>
          <option value="sport">Sport</option>
          <option value="art">Art</option>
          <option value="festivals">Festivals</option>
          </select>
        </div>
        </div>
        <div class="form-group">
          <label for="description">Description <span>***</span></label>
          <textarea rows='5' class="form-control" id="description"></textarea>
        </div>
        <p><b>Contact information:</b></p>
        <div class="form-row">
        <div class="form-group col-md-6">
          <label for="company-name">Company name</label>
          <input type="text" class="form-control" id="company-name">
        </div>
        <div class="form-group col-md-4">
          <label for="contact_person ">Contact person <span>***</span></label>
          <input type="text" class="form-control" id="contact_person">
        </div>
        </div>
        <div class="form-row">
        <div class="form-group col-md-6">
          <label for="company-mail">email</label>
          <input type="text" class="form-control" id="company-mail">
        </div>
        <div class="form-group col-md-4">
          <label for="company-phone">phone <span>***</span></label>
          <input type="text" class="form-control" id="company-phone" placeholder="+38 (000) 000-0000">
        </div>
        </div>
        <div class="form-group">
        <label for="picture">Insert the link on the picture</label>
        <input type="text" class="form-control" id="picture">
        </div>
      </form>
        </div>
        <div class="modal-footer">
          <button type="button" class="btn btn-danger closed" >Close</button>
          <button id='save' type="button" class="btn btn-success">Save changes</button>
          
        </div>
      </div>
    </div>
  </div>`);

  eventsList.empty();
  $(".event-container").empty();
  sliderContainer.hide();

  $addEventForm.appendTo($(".event-container"));
  $addEventForm.find(".closed").on("click", (e) => {
    $addEventForm.detach();
    sliderContainer.show();
    $("body,html").scrollTop(0);
  });

  $addEventForm.find("#save").on("click", (e) => {
    const city = $addEventForm.find("#city").val();
    const title = $addEventForm.find("#title").val();
    const date = $addEventForm.find("#date").val();
    const about = $addEventForm.find("#description").val();
    const picture = $addEventForm.find("#picture").val();
    const category = $addEventForm.find("#category").val();
    const company = $addEventForm.find("#company-name").val();
    const email = $addEventForm.find("#company-mail").val();
    const phone = $addEventForm.find("#company-phone").val();
    const contact_person = $addEventForm.find("#contact_person").val();

    if (
      title === "" ||
      about === "" ||
      date === "" ||
      phone === "" ||
      contact_person === ""
    ) {
      alert("pls fill in all fields");
    } else {
      addEvent({
        city,
        title,
        date,
        about,
        picture,
        category,
        company,
        email,
        phone,
        contact_person,
      }).then((resp) => {
        if (resp.data) {
          $addEventForm.hide();
          sliderContainer.show();
          $("body,html").scrollTop(0);
        } else {
          alert("No data!");
        }
      });
    }
  });
}

//shows modal of adding ne event
$("#add-event").on("click", (e) => {
  showModalAdd();
});

//execution of name-search function by click on loop
$(".main-loop").on("click", onSearchClick);

//execution of name-search function by click on Enter in input
$("#main-search").on("keyup", function (e) {
  if (e.keyCode === 13) {
    onSearchClick();
  }
});

//execution of filters-search function by click on search-button
$("#search").on("click", onTotSearchClick);

//execution of filters-search function by click on loop
$(".totsearch").on("click", onTotSearchClick);

//GET request to json for showing an appropriate sliders
$(document).ready(function () {
  let today = new Date();
  let date =
    today.getFullYear() +
    "-" +
    (today.getMonth() + 1).toString().padStart(2, "0") +
    "-" +
    today.getDate();

  $.ajax({
    method: "GET",
    url: `http://localhost:3000/events?_sort=date&date_gte=${date}&_limit=8`,
    success: showSlider,
  });
});
