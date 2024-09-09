// middleware/requireAuth.js

import { NextApiRequest, NextApiResponse } from "next";
import { LOCAL_STORAGE_KEYS } from "../config/constants";
import { checkIfEnrolledServerSide } from "@/config/functions";

// const requireEnrollmentMiddleware = async (req: NextApiRequest, res: NextApiResponse, next: any, params: any) => {
//     const { courseID, courseSlug, testID } = params
//     const cookies = req?.cookies
//     const loginStatus: any = cookies[LOCAL_STORAGE_KEYS.login_status]
//     const token: any = cookies[LOCAL_STORAGE_KEYS.token]
//     const user: any = JSON.parse(cookies[LOCAL_STORAGE_KEYS.user] ?? 'null')

//     let result: any = await checkIfEnrolled(token, user?.student, testID);

//     if (result?.length < 1) {
//         res.writeHead(302, {
//             location: `/courses/${courseID}/${courseSlug}?require_enrollment=true`,
//         })
//         res.end()
//         return;
//     }

//     next()
// };

const requireEnrollmentMiddleware = (req: NextApiRequest, res: NextApiResponse, next: any, params: any) => {
    const { courseID, courseSlug, testID } = params;
    const cookies = req?.cookies;
    const loginStatus = cookies[LOCAL_STORAGE_KEYS.login_status];
    const token = cookies[LOCAL_STORAGE_KEYS.token];
    const user = JSON.parse(cookies[LOCAL_STORAGE_KEYS.user] ?? 'null');

    checkIfEnrolledServerSide(token, user?.student, courseID)
        .then(result => {
            if (result?.length < 1) {
                res.writeHead(302, {
                    Location: `/courses/${courseID}/${courseSlug}?require_enrollment=true`,
                });
                res.end();
                return;
            } else {
                next();
                return;
            }
        })
        .catch(error => {
            // console.error('Error checking enrollment:', error);
            res.status(500).json({ error: 'Internal Server Error' });
        });
};

export default requireEnrollmentMiddleware;
