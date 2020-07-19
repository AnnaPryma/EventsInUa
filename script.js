function formatDate(date) {
  let d = new Date(date),
    month = "" + (d.getMonth() + 1),
    day = "" + d.getDate(),
    year = d.getFullYear();

  if (month.length < 2) month = "0" + month;
  if (day.length < 2) day = "0" + day;

  return [day, month, year].join("-");
}

$(document).ready(function () {
  // slick slider

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
    let path = $("#slider-container");

    $sliderItem.find(".slider-image").on("click", () => showEvent(event, path));

    return $sliderItem;
  }

  function showSliderItems(event) {
    const $sliderItemContent = createSliderItem(event);
    $sliderItemContent.appendTo($(".responsive"));
  }

  const showSlider = (resp) => {
    $.each(resp, (i, event) => {
      showSliderItems(event);
    });
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

  $.ajax({
    method: "GET",
    url: "http://localhost:3000/events?_sort=date&_limit=8",
    success: showSlider,
  });
});

//Dropdown Menu
$(".dropdown").click(function () {
  $(this).attr("tabindex", 1).focus();
  $(this).toggleClass("active");
  $(this).find(".dropdown-menu").slideToggle(300);
});
$(".dropdown").focusout(function () {
  $(this).removeClass("active");
  $(this).find(".dropdown-menu").slideUp(300);
});
$(".dropdown .dropdown-menu li").click(function () {
  $(this).parents(".dropdown").find("span").text($(this).text());
  $(this).parents(".dropdown").find("input").attr("value", $(this).attr("id"));
});

// datepicker
const DATE_PICKER_OPTIONS = {
  dateFormat: "yy-mm-dd",
};
$(function () {
  $("#start-date").datepicker(DATE_PICKER_OPTIONS);
});
$(function () {
  $("#end-date").datepicker(DATE_PICKER_OPTIONS);
});

const $modal = $(`<div id="myModal" class="modal">
<div class="modal-content">
  <span class="close">&times;</span>
  <p>Some text in the Modal..</p>
</div>
</div>`);

$("#end-date").change(function () {
  let startDate = $("#start-date").val();
  let endDate = $("#end-date").val();

  if (Date.parse(startDate) >= Date.parse(endDate)) {
    alert("End date should be greater than Start date");
    $("#end-date").val() = "";
  }
});

// arrow up
$(window).scroll(function () {
  if ($(this).scrollTop() >= 50) {
    // If page is scrolled more than 50px
    $("#return-to-top").fadeIn(200); // Fade in the arrow
  } else {
    $("#return-to-top").fadeOut(200); // Else fade out the arrow
  }
});
$("#return-to-top").click(function () {
  // When arrow is clicked
  $("body,html").animate(
    {
      scrollTop: 0, // Scroll to top of body
    },
    500
  );
});

//function to make short information about event
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
  <div class="btnn-center">
      <button class="btnn showfull" id="readMore">Read more</button>
    </div>
</li>`);

  path = $("#events-container");
  $aboutEvent.find(".showfull").on("click", () => showEvent(event, path));
  // $aboutEvent.find("#title").on("click", (e) => {
  //   showEvent(event, path);
  // });

  path.show();
  return $aboutEvent;
}

//function to show short information about event in a list
function showAboutEvent(event) {
  const $aboutEvent = createAboutEvent(event);
  $aboutEvent.appendTo($("#events-list"));
}

function showEvent(event, path) {
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
          <h3>Details:</h3>
          <p>Organization: ${event.company}</p>
          <p>e-mail:${event.email}</p>
          <p>phone: ${event.phone}</p>
          <p>contact person: ${event.contact_person}</p>
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

function onError() {
  const $errorMessage = $(
    `<li class="error"><div ><h3>No matching results</h3></div></li>`
  );
  $errorMessage.appendTo($("#events-list"));
}

//searching by name
const $mainSearchInput = $("#main-search");

function onSearchClick(e) {
  const searchVal = $mainSearchInput.val().toLowerCase().trim();
  $("#events-list").empty();
  $(".event-container").empty();
  $("#slider-container").hide();

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

$(".main-loop").on("click", onSearchClick);
$("#main-search").on("keyup", function (e) {
  if (e.keyCode === 13) {
    onSearchClick();
  }
});

// searching with filters
function onTotSearchClick(e) {
  const DEFAULT_END_DATE = "2022-12-30";
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

  let startDate = $("#start-date").val();
  let endDate = $("#end-date").val();
  if (!endDate) {
    endDate = DEFAULT_END_DATE;
  }

  $("#events-list").empty();

  $("#slider-container").hide();
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

$("#search").on("click", onTotSearchClick);
$(".totsearch").on("click", onTotSearchClick);
