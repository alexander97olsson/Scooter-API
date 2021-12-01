const FormData = require("form-data"); // behöver tydligen detta för att göra requestet. Fick iaf inte det till att fungera utan
const fetch = require("node-fetch"); // behöver också installera detta , behöver v2 så måste installera genom att göra "npm install node-fetch@2.0"
let config;

try {
    config = require("../config.json");
} catch (error) {
    console.error(error);
}

const data = {
    returnGithubResponse: async function token(res, req) {
		const data = new FormData();
		data.append("client_id", config.clientId); // Spara i env eller config
		data.append("client_secret", config.clientSecret); // Spara i env eller config
		data.append("code", req.body.code); // Denna kod tas emot
		data.append("redirect_uri", config.redirectUri); // Spara i env eller config

		fetch(`https://github.com/login/oauth/access_token`, {
			method: "POST",
			body: data,
		})
		.then((response) => response.text())
		.then((paramsString) => {
			let params = new URLSearchParams(paramsString);
			const access_token = params.get("access_token");
			return fetch(`https://api.github.com/user`, {
			 headers: {
			 	Authorization: `token ${access_token}`,
			 },
			});
		})
		.then((response) => response.json())
		.then((response) => {
		 	return res.status(200).json(response);
		 })
		.catch((error) => {
			return res.status(400).json(error);
		});
        
    },
}

module.exports = data;
