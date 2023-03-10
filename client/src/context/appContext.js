import React, { useReducer, useContext, useEffect } from "react";
import reducer from "./reducer";
import axios from "axios";

import {
	DISPLAY_ALERT,
	CLEAR_ALERT,
	REGISTER_USER_BEGIN,
	REGISTER_USER_SUCCESS,
	REGISTER_USER_ERROR,
	LOGIN_USER_BEGIN,
	LOGIN_USER_SUCCESS,
	LOGIN_USER_ERROR,
	TOGGLE_SIDEBAR,
	LOGOUT_USER,
	UPDATE_USER_BEGIN,
	UPDATE_USER_SUCCESS,
	UPDATE_USER_ERROR,
	HANDLE_CHANGE,
	CLEAR_VALUES,
	CREATE_JOB_BEGIN,
	CREATE_JOB_SUCCESS,
	CREATE_JOB_ERROR,
	GET_JOBS_BEGIN,
	GET_JOBS_SUCCESS,
	GET_SINGLE_JOB_BEGIN,
	GET_SINGLE_JOB_SUCCESS,
	SET_EDIT_JOB,
	DELETE_JOB_BEGIN,
	EDIT_JOB_BEGIN,
	EDIT_JOB_SUCCESS,
	EDIT_JOB_ERROR,
	SHOW_STATS_BEGIN,
	SHOW_STATS_SUCCESS,
	CLEAR_FILTERS,
	CHANGE_PAGE,
	SHOW_JOB_DESCRIPTION_BEGIN,
	SHOW_JOB_DESCRIPTION_SUCCESS,
	TOGGLE_JOB_DESCRIPTION,
} from "./actions";

const token = localStorage.getItem("token");
const user = localStorage.getItem("user");
const userLocation = localStorage.getItem("location");

const initialState = {
	isLoading: false,
	showAlert: false,
	alertText: "",
	alertType: "",
	user: user ? JSON.parse(user) : null,
	token: token,
	userLocation: userLocation || "",
	showSidebar: false,
	isEditing: false,
	editJobId: "",
	position: "",
	company: "",
	jobPostingURL: "",
	jobLocation: userLocation || "",
	jobTypeOptions: ["full-time", "part-time", "remote", "internship"],
	jobType: "full-time",
	job: {},
	jobDescription: "",
	toggleJobDescription: false,
	statusOptions: ["interview", "declined", "pending"],
	status: "pending",
	jobs: [],
	totalJobs: 0,
	page: 1,
	numOfPages: 1,
	stats: {},
	monthlyApplications: [],
	search: "",
	searchStatus: "all",
	searchType: "all",
	sort: "latest",
	sortOptions: ["latest", "oldest", "a-z", "z-a"],
};

const AppContext = React.createContext();

const AppProvider = ({ children }) => {
	const [state, dispatch] = useReducer(reducer, initialState);

	//axios
	const authFetch = axios.create({
		baseURL: "/api/v1",
	});

	//request headers
	authFetch.interceptors.request.use(
		(config) => {
			config.headers["Authorization"] = `Bearer ${state.token}`;
			return config;
		},
		(error) => {
			return Promise.reject(error);
		}
	);

	//response headers
	authFetch.interceptors.response.use(
		(response) => {
			return response;
		},
		(error) => {
			console.log(error.response);
			if (error.response.status === 401) {
				logoutUser();
			}
			return Promise.reject(error);
		}
	);

	const displayAlert = () => {
		dispatch({ type: DISPLAY_ALERT });
		clearAlert();
	};

	const clearAlert = () => {
		setTimeout(() => {
			dispatch({ type: CLEAR_ALERT });
		}, 3000);
	};

	const addUserToLocalStorage = ({ user, token, location }) => {
		localStorage.setItem("user", JSON.stringify(user));
		localStorage.setItem("token", token);
		localStorage.setItem("location", location);
	};

	const removeUserFromLocalStorage = () => {
		localStorage.removeItem("token");
		localStorage.removeItem("user");
		localStorage.removeItem("location");
	};

	const registerUser = async (currentUser) => {
		dispatch({ type: REGISTER_USER_BEGIN });
		try {
			const response = await axios.post("/api/v1/auth/register", currentUser);
			// console.log(`,response`, response);
			const { user, token, location } = response.data;
			dispatch({
				type: REGISTER_USER_SUCCESS,
				payload: { user, token, location },
			});
			addUserToLocalStorage({ user, token, location });
		} catch (error) {
			// console.log(error.response);
			dispatch({
				type: REGISTER_USER_ERROR,
				payload: { msg: error.response.data.msg },
			});
		}
		clearAlert();
	};

	const loginUser = async (currentUser) => {
		// console.log(`login current user`, currentUser);
		dispatch({ type: LOGIN_USER_BEGIN });
		try {
			const { data } = await axios.post("/api/v1/auth/login", currentUser);
			const { user, token, location } = data;
			dispatch({
				type: LOGIN_USER_SUCCESS,
				payload: { user, token, location },
			});
			addUserToLocalStorage({ user, token, location });
		} catch (error) {
			dispatch({
				type: LOGIN_USER_ERROR,
				payload: { msg: error.response.data.msg },
			});
		}
		clearAlert();
	};

	const toggleSidebar = () => {
		// console.log("toggle side bar");
		dispatch({ type: TOGGLE_SIDEBAR });
	};

	const logoutUser = () => {
		dispatch({ type: LOGOUT_USER });
		removeUserFromLocalStorage();
	};

	const updateUser = async (currentUser) => {
		dispatch({ type: UPDATE_USER_BEGIN });
		try {
			const { data } = await authFetch.patch("/auth/updateUser", currentUser);
			const { user, location, token } = data;
			dispatch({
				type: UPDATE_USER_SUCCESS,
				payload: { user, location, token },
			});

			addUserToLocalStorage({ user, token, location });
		} catch (error) {
			if (error.response.status !== 401) {
				dispatch({
					type: UPDATE_USER_ERROR,
					payload: { msg: error.response.data.msg },
				});
			}
		}
		clearAlert();
	};

	const handleChange = ({ name, value }) => {
		dispatch({
			type: HANDLE_CHANGE,
			payload: { name, value },
		});
	};

	const clearValues = () => {
		dispatch({
			type: CLEAR_VALUES,
		});
	};

	const createJob = async () => {
		dispatch({
			type: CREATE_JOB_BEGIN,
		});
		try {
			const {
				position,
				company,
				jobLocation,
				jobType,
				status,
				jobDescription,
				jobPostingURL,
			} = state;
			await authFetch.post("/jobs", {
				position,
				company,
				jobLocation,
				jobType,
				status,
				jobDescription,
				jobPostingURL,
			});
			dispatch({ type: CREATE_JOB_SUCCESS });
			dispatch({ type: CLEAR_VALUES });
		} catch (error) {
			if (error.response.status === 401) return;
			dispatch({
				type: CREATE_JOB_ERROR,
				payload: { msg: error.response.data.msg },
			});
		}
		clearAlert();
	};

	const getJobs = async () => {
		const { page, search, searchStatus, searchType, sort } = state;
		let url = `/jobs?page=${page}&status=${searchStatus}&jobType=${searchType}&sort=${sort}`;
		if (search) {
			url = url + `&search=${search}`;
		}

		dispatch({ type: GET_JOBS_BEGIN });
		try {
			const { data } = await authFetch(url);
			const { jobs, totalJobs, numOfPages } = data;
			dispatch({
				type: GET_JOBS_SUCCESS,
				payload: { jobs, totalJobs, numOfPages },
			});
		} catch (error) {
			console.log(error.reponse);
			logoutUser();
		}
		clearAlert();
	};

	const setEditJob = (id) => {
		dispatch({ type: SET_EDIT_JOB, payload: { id } });
	};

	const editJob = async () => {
		dispatch({ type: EDIT_JOB_BEGIN });
		try {
			const {
				position,
				company,
				jobLocation,
				jobType,
				status,
				jobDescription,
				jobPostingURL,
			} = state;

			await authFetch.patch(`/jobs/${state.editJobId}`, {
				company,
				position,
				jobLocation,
				jobType,
				status,
				jobDescription,
				jobPostingURL,
			});
			dispatch({ type: EDIT_JOB_SUCCESS });
			dispatch({
				type: CLEAR_VALUES,
			});
		} catch (error) {
			if (error.response.status === 401) return;
			dispatch({
				type: EDIT_JOB_ERROR,
				payload: { msg: error.response.data.msg },
			});
		}
		clearAlert();
	};

	const getSingleJob = async (jobId) => {
		dispatch({ type: GET_SINGLE_JOB_BEGIN });
		try {
			const { data } = await authFetch(`/jobs/${jobId}`);
			dispatch({
				type: GET_SINGLE_JOB_SUCCESS,
				payload: { data },
			});
		} catch (error) {
			console.log(error.reponse);
			logoutUser();
		}
		clearAlert();
	};

	const showJobDescription = async (jobId) => {
		dispatch({ type: SHOW_JOB_DESCRIPTION_BEGIN });
		try {
			// getSingleJob(jobId);
			const { data } = await authFetch(`/jobs/${jobId}`);
			dispatch({
				type: SHOW_JOB_DESCRIPTION_SUCCESS,
				payload: { job: data.job },
			});
		} catch (error) {
			console.log(error.reponse);
			logoutUser();
		}
		clearAlert();
	};

	const toggleJobDescription = () => {
		dispatch({ type: TOGGLE_JOB_DESCRIPTION });
	};

	const deleteJob = async (jobId) => {
		dispatch({ type: DELETE_JOB_BEGIN });
		try {
			await authFetch.delete(`/jobs/${jobId}`);
			getJobs();
		} catch (error) {
			console.log(error.response);
			logoutUser();
		}
	};

	const showStats = async () => {
		dispatch({ type: SHOW_STATS_BEGIN });
		try {
			const { data } = await authFetch.get("/jobs/stats");
			dispatch({
				type: SHOW_STATS_SUCCESS,
				payload: {
					stats: data.defaultStats,
					monthlyApplications: data.monthlyApplications,
				},
			});
		} catch (error) {
			console.log(error.response);
			logoutUser();
		}
	};

	const clearFilters = () => {
		dispatch({ type: CLEAR_FILTERS });
	};

	const changePage = (page) => {
		dispatch({ type: CHANGE_PAGE, payload: { page } });
	};

	useEffect(() => {
		getJobs();
		// eslint-disable-next-line
	}, []);

	return (
		<AppContext.Provider
			value={{
				...state,
				displayAlert,
				clearAlert,
				registerUser,
				loginUser,
				toggleSidebar,
				logoutUser,
				updateUser,
				handleChange,
				clearValues,
				createJob,
				getJobs,
				setEditJob,
				deleteJob,
				editJob,
				getSingleJob,
				showStats,
				clearFilters,
				changePage,
				showJobDescription,
				toggleJobDescription,
			}}
		>
			{children}
		</AppContext.Provider>
	);
};

const useAppContext = () => {
	return useContext(AppContext);
};

export { AppProvider, initialState, useAppContext };
