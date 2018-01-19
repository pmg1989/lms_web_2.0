import { request } from 'utils/request'

export async function query (params) {
  return request({ wsfunction: 'mod_frontservice_studentinfo_by_lesson', ...params })
}

export async function attendance (params) {
  return request({ wsfunction: 'mod_frontservice_doattendance', ...params })
}

export async function queryComment (params) {
  return request({ wsfunction: 'mod_frontservice_get_assignfeedbackcomment', ...params })
}

export async function comment (params) {
  return request({ wsfunction: 'mod_frontservice_savegrade', ...params })
}

export async function queryFeedback (params) {
  return request({ wsfunction: 'mod_frontservice_getsubmission', ...params })
}

export async function uploadRecord (params) {
  return request({ wsfunction: 'mod_frontservice_upload_student_recording', ...params })
}

export async function removeUploadRecord (params) {
  return request({ wsfunction: 'mod_frontservice_delete_file', ...params })
}

export async function uploadSong (params) {
  return request({ wsfunction: 'mod_frontservice_update_jl_song', ...params })
}
