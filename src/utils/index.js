import dayjs from 'dayjs';

export async function request(url) {
  try {
    const res = await fetch(url);
    const data = await res.json();
    return data;
  } catch (e) {
    throw e;
  }
}
//Get coordinates powers the country selection by getting the 
// latitude and logitude of your click
export async function getCoordinates() {
  try {
    const { latitude, longitude } = await request(
      'https://geolocation-db.com/json/'
    );

    return {
      latitude,
      longitude,
    };
  } catch (e) {
    throw e;
  }
}