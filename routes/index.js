var data = require("./../data.json"),
	config = require("./../config.json");

module.exports = {

	get: function (req, res, next) {
		var resource = req.params.resource,
			token = req.header.Authentication,
			itemArg = req.params[0] || req.query.id || null,
			items;
		if (token !== `bearer ${config.token}`) {
			return res.status(401).send({
				error: "Unauthorized"
			});
		} else if (data[resource] && !itemArg) {
			return returnAll(data[resource], req, res); ``
		} else if (data[resource] && itemArg) {
			items = data[resource];
			return returnSingle(items, itemArg, res);
		} else if (!data[resource] && !itemArg) {
			return returnAll(data.unknown, req, res);
		} else if (!data[resource] && itemArg) {
			items = data.unknown;
			return returnSingle(items, itemArg, res);
		}
	},

	post: function (req, res, next) {
		var id = req.body.id || (Math.ceil(Math.random() * 1000)).toString().substring(0, 3),
			returnData = req.body;
		returnData.id = id;
		returnData.createdAt = new Date().toISOString();
		if (token !== config.token) {
			return res.status(401).send({
				error: "Unauthorized"
			});
		} else
			return res.status(201).send(returnData);
	},

	put: function (req, res, next) {
		var returnData = req.body;
		returnData.updatedAt = new Date().toISOString();

		if (token !== config.token) {
			return res.status(401).send({
				error: "Unauthorized"
			});
		} else
			return res.status(200).send(returnData);
	},

	patch: function (req, res, next) {
		var returnData = req.body;
		returnData.updatedAt = new Date().toISOString();

		if (token !== config.token) {
			return res.status(401).send({
				error: "Unauthorized"
			});
		} else
			return res.status(200).send(returnData);
	},

	delete: function (req, res, next) {
		if (token !== config.token) {
			return res.status(401).send({
				error: "Unauthorized"
			});
		} else
			return res.status(204).send({});
	},

	login: function (req, res, next) {
		if (req.body.username || req.body.email) {
			if (req.body.password) {
				return res.status(200).send({
					token: config.token
				});
			} else {
				return res.status(400).send({
					error: "Missing password"
				});
			}
		} else {
			return res.status(400).send({
				error: "Missing email or username"
			});
		}
	},

	register: function (req, res, next) {
		if (req.body.username || req.body.email) {
			if (req.body.password) {
				return res.status(201).send({
					token: config.token
				});
			} else {
				return res.status(400).send({
					error: "Missing password"
				});
			}
		} else {
			return res.status(400).send({
				error: "Missing email or username"
			});
		}
	},

	logout: function (req, res, next) {
		return res.status(200).send({});
	}

};

function returnAll(items, req, res) {
	var page = parseInt(req.query.page, 10) || 1,
		pageSize = parseInt(req.query.per_page, 10) || config.pagination.page_size,
		offset = (page - 1) * pageSize,
		paginatedItems = items.slice(offset, offset + pageSize);
	return res.status(200).send({
		page: page,
		per_page: pageSize,
		total: items.length,
		total_pages: Math.ceil(items.length / pageSize),
		data: paginatedItems
	});
}

function returnSingle(items, itemArg, res) {
	var singleItem = items.filter(function (item) {
		return item.id == itemArg;
	});
	if (singleItem.length) {
		return res.status(200).send({
			data: singleItem[0]
		});
	}
	return res.status(404).send({});
}
