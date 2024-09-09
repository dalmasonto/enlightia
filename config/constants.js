import { em } from "@mantine/core"

export const DEFAULT_API_ROOT = process.env.NEXT_PUBLIC_DEFAULT_API_ROOT
export const DEFAULT_APP_URL = process.env.NEXT_PUBLIC_DEFAULT_APP_URL
export const BASE_MEDIA_URL = process.env.NEXT_PUBLIC_BASE_MEDIA_URL

export const APP_NAME = "Enlightia"
export const SEPARATOR = "|"

export const THEME_COOKIE_NAME = 'enlightia-theme'
export const APP_KEY = 'ENLIGHTIA'

// App Colors
// export const BLUE_DARK_COLOR = 'rgb(36, 42, 73)'
// export const BLUE_BG_COLOR = "#d3d6e9"

export const BLUE_DARK_COLOR = '#131419'
export const BLUE_BG_COLOR = "#fff"

export const PRIMARY_SHADE = [
    "#23A455", // 1 -> Light
    "#23A455", // 0 -> Lighter
    "#23A455", // 2 -> Main Primary Color
    "#23A455", // 3 -> Deep
    "#23A455", // 4 -> Deeper
    "#23A455", // 5 -> Light rgba 20
]


export const PRIMARY_DEEP_COLOR = '#1B2815'

export const containerSize = "lg"

export const API_ENDPOINTS = {
    // AUTH
    REGISTER: `/users/account/view`,
    LOGIN: `/users/auth/login`,
    LOGOUT: `/users/auth/logout`,
    REQUEST_PASSWORD_RESET: `/users/auth/password-reset`,
    PASSWORD_RESET_CONFIRM: `/users/auth/password-reset/confirm`,
    PASSWORD_RESET_VALIDATE_TOKEN: `/users/auth/password-reset/validate-token`,
    CHECK_LOGIN_STATUS: '/users/auth/check-login-status',
    CHANGE_PASSWORD: '/users/auth/change-password',

    // USERS
    USERS: `/users/account/view`,
    PROFILES: `/users/account/profiles`,

    // LMS
    INSTITUTIONS: `/lms/institutions`,
    INSTITUTION_ADMINS: '/lms/institutions/admins',
    INSTITUTION_INSTRUCTORS: '/lms/institutions/instructors',
    INSTITUTION_STUDENTS: '/lms/institutions/students',
    USER_INSTITUTIONS: `/lms/user-institutions`,
    INSTITUTION_MEDIA: `/lms/institution/media`,
    EVENTS: `/lms/events`,
    INSTITUTION_NOTIFICATIONS: `/lms/institution/notifications`,

    REQUESTS: '/lms/requests',
    ACCEPT_REQUEST: `/lms/accept-request`,

    ALL_INSTRUCTORS: '/lms/instructors',
    STUDENTS: '/lms/students',
    COMPLETED_COURSES: "/lms/completed-courses",
    COMPLETED_TOPICS: "/lms/completed-topics",

    COURSES: `/lms/courses`,
    COURSE_CREATE_UPDATE: `/lms/create-update-courses`,
    TOPICS: `/lms/topics`,

    COHORTS: `/lms/cohorts`,
    ENROLLMENTS: `/lms/enrollments`,

    TESTS: `/lms/tests`,
    TEST_QUESTIONS: `/lms/test-questions`,
    TEST_QUESTION_OPTIONS: `/lms/test-question-options`,
    TEST_ANSWERS: `/lms/test-answers`,
    COMPLETED_TESTS: `/lms/completed-tests`,

    // Main
    COUNTIES: `/counties`,
    CONTACT_FORM: `/contact`,
    REVIEWS: `/reviews`,
    SUBSCRIBERS: `/subscribers`,
    APP_STATS: `/app-stats`,
    USER_STATS: `/user-stats`,
    FAQs: `/faqs`,
    CATEGORIES: `/categories`,
    BLOGS: `/blogs`,
    RANDOMBLOGS: '/blogs/random-blogs',
    MEDIA: `/media`,
}

export const EMOJIS = {
    "100": "💯",
    "1234": "🔢",
    "grinning": "😀",
    "grimacing": "😬",
    "grin": "😁",
    "joy": "😂",
    "rofl": "🤣",
    "partying": "🥳",
    "partypopper": "🎉",
    "smiley": "😃",
    "smile": "😄",
    "sweat_smile": "😅",
    "laughing": "😆",
    "innocent": "😇",
    "wink": "😉",
    "blush": "😊",
    "slightly_smiling_face": "🙂",
    "upside_down_face": "🙃",
    "relaxed": "☺️",
    "yum": "😋",
    "relieved": "😌",
    "heart_eyes": "😍",
    "kissing_heart": "😘",
    "kissing": "😗",
    "kissing_smiling_eyes": "😙",
    "kissing_closed_eyes": "😚",
    "stuck_out_tongue_winking_eye": "😜",
    "zany_face": "🤪",
    "raised_eyebrow": "🤨",
    "monocle_face": "🧐",
    "stuck_out_tongue_closed_eyes": "😝",
}

export const DEFAULT_MEDIA_PAGE_SIZE = 25

export const LINK_WEIGHT = 500

export const LOCAL_STORAGE_KEYS = {
    user: `${APP_KEY}_user`,
    user_id: `${APP_KEY}_user_id`,
    token: `${APP_KEY}_token`,
    login_status: `${APP_KEY}_login_status`,
}

export const TABLE_ICON_SIZE = "22px"

export const DASHBOARD_ICON_SIZE = 36
export const DASHBOARD_ICON_STROKE = em(1)
export const DASHBOARD_STAT_COL_SIZES = { xs: 12, sm: 6, md: 4, lg: 2 }

export const QUESTION_TYPES = [
    ['oe', 'Open Ended'],
    ['sc', 'Single Choice'],
    ['mc', 'Multi Choice']
]

export const ERRORS = {
    COMPLETED_TOPIC_ERROR: "You have already completed this topic."
}

export const REQUEST_STATUS = {
    'pending': {
        color: 'yellow',
        title: 'PENDING'
    },
    'rejected': {
        color: 'red',
        title: 'REJECTED'
    },
    'accepted': {
        color: 'green',
        title: 'ACCEPTED'
    }
}
