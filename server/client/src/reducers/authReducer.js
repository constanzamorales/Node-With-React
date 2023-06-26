/* eslint-disable import/no-anonymous-default-export */
import { FETCH_USER } from "../actions/types";

export default function (state = null, action) {
	console.log(action);
	switch (action.type) {
		case FETCH_USER:
			return action.payload || false; //action.payload is the user model
		default:
			return state;
	}
}
