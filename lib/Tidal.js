const axios = require('axios');
const querystring = require('querystring');

const base = 'https://api.tidalhifi.com/v1';
const token = 'BI218mwp9ERZ3PFI';

module.exports = class Tidal {
	async login(username, password) {
		const { data: {
			userId,
			sessionId,
			countryCode
		} } = await axios.post(`${base}/login/username`, querystring.stringify({
			username,
			password
		}), {
			headers: {
 				'X-Tidal-Token': token,
				Origin: 'http://listen.tidal.com',
			}
		});

		this.userId = userId;
		this.sessionId = sessionId;
		this.countryCode = countryCode;
	}

	async search(query) {
		const { data } = await axios.get(`${base}/search`, {
			headers: {
				'X-Tidal-Token': token,
				Origin: 'http://listen.tidal.com',
			},
			params: {
				sessionId: this.sessionId,
				countryCode: this.countryCode,
				query,
				limit: 20,
				types: 'TRACKS'
			}
		});

		return data.tracks.items;
	}

	async getTrackUrl(id) {
		const { data: {
			url
		} } = await axios.get(`${base}/tracks/${id}/streamUrl`, {
			headers: {
				'X-Tidal-Token': token,
				Origin: 'http://listen.tidal.com',
			},
			params: {
				soundQuality: "LOSSLESS",
				sessionId: this.sessionId,
				countryCode: this.countryCode
			}
		});

		return url;
	}
};
