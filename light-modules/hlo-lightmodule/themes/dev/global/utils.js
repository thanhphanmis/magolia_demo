export function isEmpty(obj) {
  for (let key in obj) {
    // eslint-disable-next-line no-prototype-builtins
    if (obj.hasOwnProperty(key)) return false;
  }
  return true;
}

export function decodeSpaces(s) {
  if (!s) return '';
  s = s.replace(/\+/g, ' ');
  return s;
}

export function uniqueID() {
  return Math.random().toString(36).substr(2, 9);
}

export function formatHour(hour){
  var stripedHour = hour.replace("AM","").replace("PM","").replace(" ","").replace(":","");
  if(stripedHour.length == 3) hour = "0"+hour;
  if(hour.indexOf("PM") > -1){
    return (Number(hour.slice(0, 2))+12) + ":" + hour.slice(2);
  } else {
    return hour.slice(0, 2) + ":" + hour.slice(2);
  }
}

export function format24h(date) {
  var hours = date.getHours();
  var minutes = date.getMinutes();
  if( minutes < 10 ) minutes = "0"+minutes;
  var strTime = hours + ':' + minutes;
  return strTime;
}

export function sleep(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

export function checkOpeningTimes(currentTime, startTime, endTime) {
  let inRange = false;
  let currTime = Number(currentTime.replace('AM','').replace('PM','').replace(' ','').split(':').join(''));
  let startRangeTime = Number(startTime.replace('AM','').replace('PM','').replace(' ','').split(':').join(''));
  let endRangeTime = Number(endTime.replace('AM','').replace('PM','').replace(' ','').split(':').join(''));
  let timestamps = [];
  timestamps[0] = startRangeTime;
  timestamps[1] = endRangeTime;
  // build four item array if endDate is in next day 
  if (startRangeTime > endRangeTime) {
    timestamps[1] = 2400;
    timestamps[2] = 0;
    timestamps[3] = endRangeTime;
  }

  if (timestamps[0] <= currTime && timestamps[1] >= currTime || (timestamps.length > 2 && timestamps[2] <= currTime && timestamps[3] >= currTime))
    inRange = true;

  return inRange;
}

export async function loadGoogleMapsApi(errorHandler = {}) {
  return new Promise((res) => {
    if (window.google && window.google.maps) {
      // resolve early if google maps has already been set
      res(window.google.maps);
    } else {
      window.gm_authFailure = errorHandler;
      window.loadGoogleMapsApiCompleted = () => {
        res(window.google.maps);
      };
      let keyparam, path;
      try {
        keyparam = '&key=AIzaSyATpbEbXKfHYtfrabN-UJP5ZsFNNbVUWYo';
        path = `https://maps.googleapis.com/maps/api/js?${keyparam}&callback=loadGoogleMapsApiCompleted`;
      } catch (err) {
      }

      if (document.getElementById('load-google-maps') === null) {
        // only attach script if google maps script has not already been attached;
        let s = document.createElement('script');
        s.id = 'load-google-maps';
        s.setAttribute('src', path);
        s.setAttribute('type', 'text/javascript');
        document.getElementsByTagName('head')[0].appendChild(s);
      }
    }
  });
}

export async function getGoogleMapsURL(agentData) {
  const GOOGLE_MAPS_URL_PREFIX = 'https://www.google.com/maps/search/?api=1';
  const { latitude: lat, longitude: lng, agentName, addressLine3, addressLine2, state, providerName, postcode } = agentData;
  const latlng = {
    lat: parseFloat(lat),
    lng: parseFloat(lng),
  };
  const address = `${agentName} ${addressLine2} ${addressLine3} ${providerName} ${postcode} ${state}`;
  let place_id;
  const { results, status } = await this.getGeocodeData({ address });
  if (status === google.maps.GeocoderStatus.OK) {
    place_id = results[0].place_id;
  }
  return `${GOOGLE_MAPS_URL_PREFIX}&query=${latlng.lat},${latlng.lng}&query_place_id=${place_id}`;
}

export function getLatLngByzipcode(geocodeRequestParams, geocoderObj) {
  if (typeof geocodeRequestParams !== 'object') {
    geocodeRequestParams = {
      address: 'zipcode ' + geocodeRequestParams,
    };
  }

  return new Promise(function (resolve, reject) {
    let latlong = (async () => {
      let geocoder = null;
      if (geocoderObj != null) {
        geocoder = geocoderObj;
        console.log('using geocoderObj');
      } else {
        geocoder = new (await loadGoogleMapsApi()).Geocoder();
      }
      geocoder.geocode(geocodeRequestParams, function (results, status) {
        if (status == google.maps.GeocoderStatus.OK) {
          let latitude = results[0].geometry.location.lat();
          let longitude = results[0].geometry.location.lng();
          latlong = {
            latitude: latitude,
            longitude: longitude,
          };
        } else {
          latlong = {
            latitude: 0,
            longitude: 0,
          };
        }
        resolve(latlong);
        return latlong;
      });
    })();
  });
}

export function formatNumSimple(num) {
  return (num*1).toLocaleString("en-US");
}


export function parseDateString(dateString) {
  const months = [
    "January", "February", "March", "April", "May", "June",
    "July", "August", "September", "October", "November", "December"
  ];

  const dateParts = dateString.split(' ');
  const day = parseInt(dateParts[0], 10);
  const monthIndex = months.indexOf(dateParts[1]);
  const year = parseInt(dateParts[2], 10);

  if (day && monthIndex !== -1 && year) {
    const parsedDate = new Date(year, monthIndex, day);
    return parsedDate;
  } else {
    return null; // Return null for invalid date format
  }
}

export function getUrlQueryString(name, str) {
  const _name = name.replace(/[\[]/, '\\[').replace(/[\]]/, '\\]');
  const regex = new RegExp(`[\\?&]${_name}=([^&#]*)`);
  const results = regex.exec(str || decodeURIComponent(window.location.search));
  return results === null ? '' : results[1].replace(/\+/g, ' ');
}

export function showLoading() {
  let loading = null,
    overlay = null;

  if (document.querySelector('.hlo-loading')) {
    loading = document.querySelector('.hlo-loading');
    overlay = document.querySelector('.hlo-overlay');
    loading.classList.add('active');
    overlay.classList.add('active');
  } else {
    const body = document.querySelector('body');
    loading = document.createElement('div');
    overlay = document.createElement('div');

    loading.classList.add('hlo-loading');
    loading.classList.add('active');
    overlay.classList.add('hlo-overlay');
    overlay.classList.add('active');
    body.appendChild(loading);
    body.appendChild(overlay);
  }
}

export function hideLoading() {
  const loading = document.querySelector('.hlo-loading');
  const overlay = document.querySelector('.hlo-overlay');
  if (loading) {
    loading.classList.remove('active');
    overlay.classList.remove('active');
  }
}

export function showOverlay () {
  let overlay = null;
  if (document.querySelector('.hlo-overlay')) {
    overlay = document.querySelector('.hlo-overlay');
    overlay.classList.add('active');
  } else {
    const body = document.querySelector('body');
    overlay = document.createElement('div');
    overlay.classList.add('hlo-overlay');
    overlay.classList.add('active');
    body.appendChild(overlay);
  }
}

export function hideOverlay () {
  const overlay = document.querySelector('.hlo-overlay');
  if (overlay) {
    overlay.classList.remove('active');
  }
}

// 1703955600000
// ---> 31 Dec 2023
export function formatDateFromTimestamp(timestamp) {
  const date = new Date(timestamp);
  const months = [
    'Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun',
    'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'
  ];
  const day = date.getDate();
  const month = months[date.getMonth()];
  const year = date.getFullYear();
  return `${day} ${month} ${year}`;
}

// 30 August 2023 -> 2023-08-30
export function formatDateSelect(date) {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
}

// 30 August 2023 -> 2023-08-29
export function getPreviousDay(date) {
  const previousDayTimestamp = date.getTime() - 24 * 60 * 60 * 1000; // Subtract 1 day in milliseconds
  const previousDayDate = new Date(previousDayTimestamp);
  return previousDayDate;
}

// 1703955600000
// ---> 31 December
export function formatDateToDayMonth(timestamp) {
  const date = new Date(timestamp);
  const months = [
    "January", "February", "March", "April", "May", "June",
    "July", "August", "September", "October", "November", "December"
  ];
  const day = date.getDate();
  const month = months[date.getMonth()];
  // const year = date.getFullYear();
  return `${day} ${month}`;
}

export function formatDateToFullDate(timestamp, format = 'fullDate') {
  const date = new Date(timestamp);
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  const year = date.getFullYear();
  if (format === 'fullDate') {
    return `${year}-${month}-${day}`;  //  ---> 2023-08-29
  } else if (format === 'setDateRange') {
    return `${month}/${day}/${year}`; //  ---> 08/29/2023
  }
  throw new Error('Invalid date format.');
}

export function removeItemFromArray(array, itemToRemove) {
  const index = array.indexOf(itemToRemove);
  if (index > -1) {
      array.splice(index, 1);
  }
  return array;
}

export function getParameterByName(name, url = window.location.href) {
  name = name.replace(/[\[\]]/g, '\\$&');
  const regex = new RegExp(`[?&]${name}(=([^&#]*)|&|#|$)`);
  const results = regex.exec(url);
  if (!results) return null;
  if (!results[2]) return '';
  return decodeURIComponent(results[2].replace(/\+/g, ' '));
}

export function unWrap(wrapper) {
  // place childNodes in document fragment
  const docFrag = document.createDocumentFragment();
  while (wrapper.firstChild) {
    const child = wrapper.removeChild(wrapper.firstChild);
    docFrag.appendChild(child);
  }
  // replace wrapper with document fragment
  wrapper.parentNode.replaceChild(docFrag, wrapper);
}