# Doctor --- Product Discovery & Decision Log

**Document version:** 1.0\
**Date:** 12 November 2026\
**Project status:** Product discovery closed; PRD v1.0 drafted;
development not yet started.\
**Purpose:** Preserve the project context, product questions, decisions,
and unresolved items so work can continue in a new conversation without
repeating discovery.

------------------------------------------------------------------------

# 1. Project Overview

## What is Doctor?

**Doctor** is a medical discovery, appointment booking, and live queue
management platform.

It connects: - Patients looking for doctors and medical
establishments. - Doctors managing consultations across one or more
locations. - Medical establishment owners managing doctors, schedules,
capacity, and operations. - Super Admins verifying users and
establishments and overseeing platform activity.

## Problem being solved

Patients often book or visit a clinic but have little idea how long they
will wait. Doctor aims to let patients discover verified doctors, book a
sequential appointment token, and monitor queue progress remotely
instead of sitting in a waiting room for hours.

## Core product promise

> A patient can discover a verified doctor, book a token, and monitor
> their position in the consultation queue without spending unnecessary
> hours waiting physically at the clinic.

## Why this project is being built

The project is intended to be a serious portfolio and job-pitch product,
particularly for approaching Sheryians. The goal is to demonstrate: 1.
Product thinking and the ability to identify a real problem. 2.
Engineering ability across frontend, backend, databases, authentication,
and real-time systems. 3. Ownership: the ability to build a product from
scratch and explain the reasoning behind its design.

The user lost their job on **2 November 2026** because the company shut
down and set a short employability-focused timeline. Doctor is intended
to become the flagship project used to demonstrate practical ability in
interviews.

## Product users and portals

1.  **Patient portal** --- discovery, booking, queue tracking, patient
    profiles, reviews, support.
2.  **Doctor portal** --- professional profile, verification,
    associations, schedules, sessions, queue operations.
3.  **Medical Establishment portal** --- establishment verification,
    doctor associations, schedule/capacity approvals, operations.
4.  **Super Admin portal** --- verification, moderation, complaints,
    support, user management, audit logs.

Separate frontend entry points are planned, with shared backend
authentication and authorization infrastructure.

## Proposed technology direction

This is the proposed practical stack, not a requirement to use every
technology regardless of need:

-   Frontend: React / Next.js
-   Language: JavaScript
-   Styling: Tailwind CSS
-   Components: shadcn/ui
-   Backend: Node.js + Express
-   Database: MongoDB + Mongoose
-   API requests: Axios
-   Server state: TanStack Query
-   Real-time: Socket.IO
-   Scheduled jobs: node-cron
-   Push notifications: Web Push

Avoid unnecessary complexity. Redis, microservices, TypeScript,
PostgreSQL, Redux, and online payments should not be added just to make
the stack look impressive. Reconsider a technology only when a concrete
requirement justifies it.

------------------------------------------------------------------------

# 2. Discovery Approach

The discovery process used one product question at a time. The intent
was to clarify the real-world workflow before writing the PRD or coding.

Important working principles: - Preserve decisions already made; do not
ask the same question again. - Distinguish confirmed decisions from
drafted/deferred items. - Separate the long-term product vision from the
MVP. - Do not invent requirements to fill a numbered decision. - Keep
the first release small enough to build and demonstrate. - Treat the PRD
as product requirements, not as a final database schema or API
specification.

**Note on numbering:** The discovery log below records the decisions
from the project conversation. Some later questions were recognized as
already covered by earlier decisions. The final two decisions in this
conversation were appointment reminders (Decision 068) and token grace
period (Decision 069).

------------------------------------------------------------------------

# 3. Questions and Decisions Log

## Decision 001 --- Queue and token model

**Question/theme:** How should appointment tokens and the consultation
queue work?

**Decision: Hybrid sequential token queue.** - Patients can book in
advance or while a session's booking window is active. - Confirmed
appointments receive sequential tokens. - Token numbers remain fixed. -
Queue position can change due to cancellations, skipped patients, or
staff-managed operations. - Token number and current queue position are
different concepts. - Cancelled token numbers are never reused.

## Decision 002 --- Advance booking and live booking

**Question/theme:** Should patients book only in advance or also during
an active session?

**Decision: Both.** - Advance booking is supported. - Live booking is
supported during the defined booking window. - Both booking types join
the same sequential queue. - Normal confirmed bookings cannot exceed
approved session capacity.

## Decision 003 --- Patient arrival and check-in

**Question/theme:** Should patients have to check in when physically
arriving?

**Decision: No mandatory arrival tracking/check-in in MVP.** - Physical
arrival does not automatically change appointment status. - Patients can
arrive and wait. - Status changes when staff/doctor calls the token and
updates the system. - When consultation begins, appointment status
becomes `IN_CONSULTATION`. - This overrides earlier ideas about
mandatory staff check-in.

## Decision 004 --- Patient cancellation

**Question/theme:** Can patients cancel their bookings?

**Decision: Flexible cancellation before consultation begins.** -
Cancellation frees capacity for rebooking. - Cancelled token number
remains retired. - Queue positions are recalculated. - Cancellation
history is preserved. - Exact edge cases around an already-called token
or active consultation need implementation rules.

## Decision 005 --- Queue management authority

**Question/theme:** Who can operate the live queue?

**Decision: Doctor and authorized establishment staff.** - Staff is the
primary day-to-day operator. - Doctor has control/oversight. -
Authorized users can advance the queue, skip patients, reinstate
patients, mark consultations completed, and manage the queue. - Every
important queue action records actor, action, affected appointment, and
timestamp. - Automatic advancement versus manual confirmation of the
next token remains a workflow detail to settle during implementation.

## Decision 006 --- Doctor onboarding and multiple locations

**Question/theme:** How do doctors join the platform and work across
clinics?

**Decision: Independent doctor registration with separate verification
and association.** - Doctors register independently and submit
professional credentials for verification. - Doctors can request
association with an establishment. - Establishment owners can invite
doctors. - The other party approves/accepts the association. - A doctor
can consult at multiple establishments and at a personal clinic. -
Doctor identity, establishment/location, and doctor-establishment
association are separate concepts. - Schedules, sessions, capacity, and
fees can differ by location. - Professional verification is separate
from association approval.

## Decision 007 --- Establishment onboarding

**Question/theme:** How should clinics/medical establishments join?

**Decision: Self-service owner registration plus Super Admin
verification.** - Owner creates establishment profile and submits
documents. - Establishment remains hidden from public discovery and
booking until verified. - Proposed statuses: `DRAFT`, `PENDING`,
`UNDER_REVIEW`, `ACTION_REQUIRED`, `VERIFIED`, `REJECTED`,
`SUSPENDED`. - Exact documents must be researched by establishment type
and applicable Indian rules; do not assume one universal checklist.

## Decision 008 --- Discovery entry points

**Question/theme:** Should patients search for doctors or clinics?

**Decision: Both doctor-first and establishment-first discovery.** -
Doctor → profile → associated locations → sessions → booking. -
Establishment → profile → doctors → sessions → booking. - Filters
include specialization, location, availability, experience, ratings, and
establishment type as relevant.

## Decision 009 --- Reviews

**Question/theme:** Who can review a doctor or establishment?

**Decision: Verified appointment reviews only.** - Only patients with
completed appointments can review. - One review per completed
appointment. - Doctor rating and establishment rating are separate. -
Patients can report reviews. - Super Admin moderates reported reviews. -
Only `COMPLETED` appointments qualify.

## Decision 010 --- Notifications

**Question/theme:** Which notification channels should MVP support?

**Decision: In-app and push notifications.** - Real-time queue changes
use Socket.IO. - Push notifications alert users when the app is not
open. - SMS, WhatsApp, and email notifications are deferred. - Use a
central notification service.

## Decision 011 --- Authentication

**Question/theme:** How should different user roles authenticate?

**Decision: Passwordless mobile OTP for patient, doctor, and
establishment owner.** - OTP login/registration. - If phone number is
unknown, create a new account and complete the relevant profile. -
Doctor and owner onboarding includes role-specific information and
verification. - Super Admin uses securely provisioned accounts and
stronger authentication. - OTP expiry, resend limits, attempt limits,
rate limiting, session management, and anti-enumeration are required. -
Separate role portals, shared backend authentication infrastructure.

## Decision 012 --- Patient medical profile

**Question/theme:** What medical information belongs in the MVP profile?

**Decision: Minimal profile.** - Blood group is optional, user-provided,
and unverified. - Consultation history is included. - Full medical
records and advanced health history are deferred. - Blood group values:
A+, A-, B+, B-, AB+, AB-, O+, O-, Unknown.

## Decision 013 --- Session capacity approval

**Question/theme:** Who sets the maximum number of patients per session?

**Decision: Doctor proposes; establishment owner approves.** - Only
approved sessions become bookable. - Capacity cannot be reduced below
active bookings once bookings have begun. - Independent clinic capacity
control needs a final technical rule; expected to be doctor-managed.

## Decision 014 --- Doctor-initiated session cancellation

**Question/theme:** What if a doctor cannot conduct a scheduled session?

**Decision: Doctor can cancel with a reason.** - Affected patients are
notified. - Appointments are cancelled. - History is preserved. -
Patients make a fresh booking elsewhere or in another session. -
Rebooking creates a new appointment and token. - No online payment in
MVP, so payment refunds are not part of the initial workflow.

## Decision 015 --- Schedule management

**Question/theme:** Who controls schedules at associated clinics and
personal clinics?

**Decision: Shared approval at associated establishments; doctor-managed
personal clinic.** - Doctor proposes schedules at associated
establishments. - Owner approves or requests changes. - Either party can
request future schedule changes. - Doctor manages independent clinic
schedules. - Existing bookings are not silently modified by schedule
changes. - Distinguish general availability, approved schedule, and
actual dated bookable session.

## Decision 016 --- Payments

**Question/theme:** Should patients pay online?

**Decision: Phased payments.** - MVP: offline payment at the clinic. -
Where needed, record payment as `PENDING` or `PAID`. - Phase 2: consider
Razorpay for online payments, failures, refunds, and transaction
handling. - Online payments must not delay core booking and queue
functionality.

## Decision 017 --- Remote live queue tracking

**Question/theme:** What should a patient see while waiting remotely?

**Decision: Live queue visibility.** - Own token. - Currently serving
token. - Number of patients ahead. - Live queue progress. - Doctor
arrival status. - Whether session has started. - Delays, pauses, or
cancellation status. - Estimated waiting time was later deferred. -
"Your turn is approaching" alert trigger remains to be finalized. -
Doctor arrival status is manually updated, not inferred.

## Decision 018 --- No-show and skipped token

**Question/theme:** What happens if a patient does not respond when
called?

**Decision: Staff-controlled skip.** - After the grace period, staff can
mark patient `SKIPPED`. - Appointment is not automatically cancelled or
marked no-show. - Staff/doctor decides whether to bring patient back. -
Reinstatement is manual and audit-logged. - Reinstatement does not
automatically restore original queue position. - `SKIPPED` is a queue
state, not appointment cancellation.

## Decision 019 --- Live booking and over-capacity

**Question/theme:** What happens when a session is full?

**Decision: Over-capacity request, not automatic overbooking.** - Normal
live booking is open during the booking window. - If capacity is
available, booking is confirmed. - If full, patient can submit a
request. - Request is `PENDING_APPROVAL`/waiting list; it has no
confirmed token and is not in the active queue. - Doctor/staff can
approve or reject. - Explicit authorization is required to exceed
approved capacity. - Approval is audit-logged. - Later clarification: if
session is scheduled 9--10, booking opens at 9 and normal booking closes
at 10. Consultation may continue beyond 10. - Staff/doctor can manually
add patients after booking closes.

## Decision 020 --- Over-capacity request ordering

**Question/theme:** How should waiting-list requests be prioritized?

**Decision: First-come, first-served with authorized override.** -
Default waiting-list order is submission time. - Staff/doctor may
prioritize or reject with reason. - Actions are audited.

## Decision 021 --- Arrival tracking clarification

**Question/theme:** Does physical arrival change appointment state?

**Decision: No.** - Reaffirmed Decision 003. - No mandatory check-in. -
Staff/doctor updates system when token is called. - Do not reintroduce
arrival status as a required patient action.

## Decision 022 --- Unified booking across discovery paths

**Question/theme:** Do doctor-first and clinic-first searches use
separate booking systems?

**Decision: One unified booking/queue system.** - Both paths lead to the
same session and appointment model. - Session belongs to
doctor-establishment association. - One booking and queue system handles
both.

## Decision 023 --- Patient dashboard and multiple bookings

**Question/theme:** What does the patient dashboard show, and can
patients book multiple appointments?

**Decision:** - Dashboard sections: Upcoming, Active, History. -
Appointment detail shows token, doctor, establishment, address,
date/session, current token, number ahead, live queue, and cancellation
option where eligible. - Multiple simultaneous bookings are allowed. -
Overlapping times generate a warning but are not blocked.

## Decision 024 --- Booking confirmation and ticket

**Question/theme:** What confirmation does a patient receive?

**Decision:** - In-app confirmation and push notification. -
Downloadable appointment ticket in PDF. - Ticket contains patient name,
token, doctor/specialty, clinic/address, date/time, and booking
reference. - QR verification is deferred.

## Decision 025 --- Rescheduling

**Question/theme:** How can an appointment be rescheduled?

**Decision:** - Future appointment: patient selects another available
session; system creates a new appointment/token and cancels old one. -
Active-session appointment: staff approval required. - Old token is
retired. - Failed rescheduling must not cancel original appointment. -
Capacity must be checked.

## Decision 026 --- Doctor profile and location-specific fees

**Question/theme:** What information is public and who controls fees?

**Decision:** - Public profile includes photo, name, specialization,
qualifications, registration details, experience, languages, clinics,
available sessions, and verified reviews. - Fees can differ by
establishment. - Doctor proposes fee; establishment owner reviews it
before public visibility. - Existing bookings retain the fee recorded at
booking.

## Decision 027 --- Verification before public visibility

**Question/theme:** Can unverified doctors or clinics appear in search?

**Decision: No.** - Doctor and establishment must be verified before
discovery/booking. - Professional verification, establishment
verification, and association approval are separate. - Credential expiry
or suspension blocks new bookings.

## Decision 028 --- Session cancellation authority

**Question/theme:** Who can cancel a session?

**Decision:** - Doctor and authorized establishment staff can cancel
with a reason. - Patients are notified. - Records are preserved.

## Decision 029 --- Substitute doctor

**Question/theme:** Can another doctor take over a cancelled doctor's
session?

**Decision: No substitute doctor in MVP.** - If doctor unavailable,
session is cancelled. - Patients are notified. - They make a fresh
booking with another doctor. - No automatic appointment transfer.

## Decision 030 --- Emergency cancellation during an active session

**Question/theme:** What if a doctor must stop in the middle of a
session?

**Decision:** - Current consultation may finish if possible. - Completed
appointments remain completed. - Only remaining appointments are
cancelled if the session cannot continue. - Affected patients are
notified. - Reason, actor, timestamp, and affected counts are preserved.

## Decision 031 --- Doctor leave and date blocking

**Question/theme:** Can doctors block days off?

**Decision:** - Doctors can block specific dates for leave, holidays, or
emergencies. - No new sessions can be created on blocked dates. -
Existing sessions/bookings follow cancellation workflow. - Associated
establishments are notified.

## Decision 032 --- Location-specific or global availability blocks

**Question/theme:** Can a doctor block one clinic or every clinic?

**Decision:** - A block can apply to one location or all associated
locations. - Global block includes all associated establishments and
personal clinic. - Existing bookings use cancellation workflow. -
Changes are audit-logged.

## Decision 033 --- Consultation history privacy

**Question/theme:** Who can see consultation history?

**Decision:** - Patients see their own history. - Doctors see relevant
consultations. - Establishments see only relevant appointment
information. - History includes doctor/specialization, establishment,
date/session, token, status, fee, cancellation and rescheduling
information.

## Decision 034 --- Doctor analytics

**Question/theme:** What analytics should doctors receive?

**Decision:** - MVP: appointment totals, completed, cancelled,
skipped/no-show counts, daily count, upcoming. - Location-specific and
combined reports. - Phase 2: advanced trends, revenue, patient
distribution, patterns, location performance, and capacity
utilization. - Revenue is based on recorded collections, not assumed
platform income.

## Decision 035 --- Establishment owner dashboard and scheduled jobs

**Question/theme:** What does the owner dashboard show, and what
automation is useful?

**Decision:** - MVP owner dashboard: associated doctors, today's
appointments, completed/cancelled consultations, doctor-wise
performance, revenue overview. - Revenue separates expected collections
from recorded offline collections. - Scheduled jobs can support
reminders, daily reports, schedule processing, notification retries, and
cleanup. - Initial single-instance MVP can use `node-cron`. -
Multi-instance production needs distributed scheduling/locking or an
external queue. - Jobs must be idempotent. - Queue updates use Socket.IO
events, not cron polling.

## Decision 036 --- Super Admin authority

**Question/theme:** What can Super Admin control?

**Decision:** - Full platform administration: users,
doctor/establishment verification, association oversight, moderation,
complaints, analytics, settings, notifications, jobs, audit logs. -
Sensitive actions record actor, change, timestamp, and reason. -
Critical actions require confirmation/re-authentication.

## Decision 037 --- Patient complaints

**Question/theme:** Can patients formally complain?

**Decision:** - Complaints can concern doctor, establishment,
appointment handling, fees, or unprofessional behaviour. - Super Admin
investigates, requests explanations, resolves or rejects. - Statuses:
`OPEN`, `UNDER_REVIEW`, `RESOLVED`, `REJECTED`.

## Decision 038 --- Patient support

**Question/theme:** What support channel is included?

**Decision:** - MVP support ticket system; no live chat. - Ticket has
category, description, optional images, status tracking, and
responses. - Admin can view, assign, respond, and update status. -
Statuses: `OPEN`, `IN_PROGRESS`, `RESOLVED`, `CLOSED`.

## Decision 039 --- Staff accounts

**Question/theme:** How should establishment staff accounts and roles
work?

**Status: DRAFTED / PENDING FINALIZATION.** - Early ideas included
Owner, Manager, Receptionist and granular permissions. - A possible
invitation flow was discussed: owner invites; employee registers using
own mobile OTP; owner approves. - User asked to stop and mark the whole
staff account model as drafted because it became confusing. - Do not
treat these roles or invitation details as finalized MVP requirements. -
The broader concept of "authorized establishment staff" operating queues
remains accepted.

## Decision 040 --- Staff access across establishments

**Question/theme:** Can one staff member work across multiple
establishments?

**Status: NOT FINALIZED.** - Bundled with the staff account model. - Do
not assume multi-establishment access.

## Decision 041 --- Location discovery

**Question/theme:** How should patients specify their location?

**Decision: Both automatic and manual location.** - Device location is
optional. - Manual search supports city, locality, and PIN code. -
Denying location permission must not block discovery.

## Decision 042 --- Search scope and filters

**Question/theme:** What search capability belongs in MVP?

**Decision: Basic search and useful filters.** - Search by doctor name,
specialization, establishment. - MVP filters: specialization, location,
availability, consultation fee. - Advanced sorting, combined filters,
personalized recommendations and smarter ranking are Phase 2. - Only
verified doctors/establishments appear.

## Decision 043 --- Search ranking

**Question/theme:** How are search results ordered?

**Decision: Simple relevance-based ranking.** - Consider relevance,
availability, distance, verified ratings. - No pay-to-rank. - Keep MVP
algorithm simple and improve later.

## Decision 044 --- Favourites

**Question/theme:** Can patients save doctors and establishments?

**Decision: Yes.** - Patients can favourite doctors and
establishments. - Dashboard shows favourites. - Notify when a favourite
doctor publishes new sessions. - Advanced personalized recommendations
are Phase 2.

## Decision 045 --- Multiple patient profiles

**Question/theme:** Can one account manage family members?

**Decision: Yes, simple multiple profiles.** - One account can manage
multiple patient profiles and book for them. - Each profile has separate
history. - Appointment is linked to actual patient. - Do not build
complicated adult consent/family permission hierarchies in MVP.

## Decision 046 --- Patient profile fields

**Question/theme:** What information is required for a patient profile?

**Decision:** - Required: full name, date of birth. - Optional: gender,
blood group, photo. - Account phone is used for OTP. - Additional family
profiles do not need separate phone numbers.

## Decision 047 --- Booking for someone else

**Question/theme:** How does an account holder book for another person?

**Decision: Simple "for myself / for someone else" flow.** -
Enter/select basic details for the other person. - Save frequently used
profiles. - Appointment and history attach to the correct patient. -
Avoid complex family permission hierarchies.

## Decision 048 --- Duplicate bookings

**Question/theme:** How do we prevent duplicate appointments?

**Decision:** - Prevent duplicate same patient + doctor +
establishment + session. - Same account can book the same session for
different patient profiles. - Check pending over-capacity requests
too. - Cancelled booking must not permanently block rebooking.

## Decision 049 --- Live booking deadline

**Question/theme:** When does normal live booking close?

**Decision: Covered by Decision 019 and later clarified by Decision
053.** - Booking opens at scheduled booking start and closes at
scheduled booking end. - Consultation may continue beyond booking end. -
Authorized staff/doctor can manually add a patient after booking
closes. - Do not treat scheduled booking end as consultation deadline.

## Decision 050 --- Queue pause/resume

**Question/theme:** How should a queue be paused and resumed?

**Status: DRAFTED / NOT FINALIZED.** - Earlier discussion suggested
doctor and authorized staff could pause/resume. - User asked to defer
the entire workflow. - Permissions, time limits, notifications, EWT
recalculation, and extended interruptions remain undecided. - Do not
treat pause/resume as a fully specified MVP feature.

## Decision 051 --- Session activation

**Question/theme:** Does a session automatically start at scheduled
time?

**Decision: No automatic consultation start.** - At scheduled start,
session becomes `READY_TO_START`. - Patients can see scheduled time has
arrived. - Doctor arrival is not assumed. - Doctor/authorized staff
manually starts session, changing it to `IN_PROGRESS`. - Scheduled
start, doctor arrival, and actual consultation start are separate
concepts.

## Decision 052 --- Session closure

**Question/theme:** Does a session automatically end after the scheduled
time or last appointment?

**Decision: Manual closure.** - When appointments are resolved, system
suggests ending session. - Doctor/authorized staff confirms. -
Skipped/unresolved appointments must be handled. - Completed appointment
history remains unchanged. - Closure is audit-logged.

## Decision 053 --- Booking window versus consultation duration

**Question/theme:** What does a session such as 9 PM--10 PM actually
mean?

**Decision: 9--10 PM is the booking window, not a consultation
deadline.** - `bookingStartAt`: when normal booking opens. -
`bookingEndAt`: when normal booking closes. - Actual consultation start
timestamp is separately recorded. - `actualSessionCompletedAt` records
actual completion. - Existing bookings remain valid after booking window
closes. - Session remains open until doctor/staff manually ends it. - Do
not automatically close based on scheduled time, elapsed time, or
patient count. - A session cannot end while consultation is active or
confirmed/skipped appointments remain unresolved.

## Decision 054 --- Manual patient addition after booking closes

**Question/theme:** Can staff add patients after the normal booking
window?

**Decision: Yes, manually.** - Staff/doctor adds patient. - System
assigns next available token; no manual token number. - Duplicate check
applies. - Queue recalculates. - Actor, time, and reason are audited. -
Exceeding approved capacity requires explicit authorization.

## Decision 055 --- Estimated waiting time

**Question/theme:** Should MVP calculate and display an estimated
waiting time?

**Status: DRAFTED / NOT FINALIZED; not committed to MVP.** - User
questioned its value and agreed it is not necessary for MVP. - Queue can
show currently serving token, patient's token, patients ahead, and live
progress. - EWT algorithm and notification trigger deferred.

## Decision 056 --- Patient notifications

**Question/theme:** Should patients be notified for every queue
movement?

**Decision: Relevant notifications only.** - Booking confirmation. -
Cancellation. - Session started/cancelled. - Turn approaching (trigger
not finalized). - Over-capacity request approval/rejection. - Important
delay. - No notification for every token call or every queue movement.

## Decision 057 --- Doctor, owner, staff and admin notifications

**Question/theme:** What operational notifications do other roles
receive?

**Decision: Role-specific notifications.** - Doctor: bookings,
cancellations, over-capacity requests, reminders, associations,
verification. - Owner: bookings, cancellations, schedule changes,
associations, staff access, session cancellation. - Staff: bookings,
cancellations, queue updates, reminders, assignments. - Admin:
verification requests, complaints, reports, suspicious activity,
platform alerts.

## Decision 058 --- Notification centre

**Question/theme:** Should notifications be stored and accessible later?

**Decision: Yes.** - Every role has notification centre. - History,
timestamp, read/unread state, deep link. - Read notifications remain
accessible. - Users cannot manually delete notification history. -
Notifications are stored in database and scoped to owner. - Retention
policy deferred.

## Decision 059 --- Notification preferences

**Question/theme:** Can users disable notifications?

**Decision: Optional push can be disabled; essential notifications
cannot.** - Optional push: favourites, new sessions, promotions/platform
updates. - Essential: booking confirmation/cancellation, session
cancellation, request approval/rejection, account security. - In-app
history remains.

## Decision 060 --- Single active login session

**Question/theme:** Can the same account remain logged in on multiple
devices?

**Decision: One active device session per account.** - Login on Phone B
invalidates Phone A server-side. - Old credentials become unusable on
protected APIs. - User receives new-login notification. - Server-side
session version/refresh token management required.

## Decision 061 --- Logout

**Question/theme:** Can users remotely log out other devices?

**Decision: Normal current-device logout only.** - Logout invalidates
current active session. - No remote logout feature. - Lost phone
recovery through OTP login on another device.

## Decision 062 --- Account deletion

**Question/theme:** Can users delete their account without admin
approval?

**Decision: Self-service deletion request.** - OTP verification. - No
Super Admin approval required. - Delete/anonymize personal data where
legally permissible. - Preserve records legally required for audit,
health, or financial purposes. - Existing appointments must be handled
without destroying legally required records.

## Decision 063 --- OTP for sensitive operations

**Question/theme:** Which operations require OTP?

**Decision:** - Login/registration. - Account deletion. - Registered
mobile number change. - OTP expiry, resend cooldown, max attempts, rate
limits, anti-abuse controls.

## Decision 064 --- Account recovery

**Question/theme:** How can a user recover access?

**Decision: Two possible recovery routes.** - Email recovery. - Super
Admin-assisted identity verification. - Email alone must not be enough
to rebind a phone number without robust checks. - Existing sessions
invalidated and recovery audit-logged.

## Decision 065 --- Separate portals

**Question/theme:** Should all roles use one frontend or separate role
portals?

**Decision: Separate portal entry points.** - Patient. - Doctor. -
Medical Establishment. - Super Admin. - Shared backend authentication
and authorization infrastructure. - Role-specific onboarding.

## Decision 066 --- Multi-role account switching

**Question/theme:** Can a user have multiple roles and switch between
portals?

**Decision: Phase 2.** - Long-term architecture should support one
identity with multiple verified role memberships and a portal
switcher. - MVP defers multi-role switching. - Do not build the full
role-switching UI in MVP.

## Decision 067 --- Shared identity across portals

**Question/theme:** How should identity work if a patient later
registers as a doctor or establishment owner?

**Decision: Shared identity architecture accepted in principle;
multi-role capability deferred.** - Separate frontend entry points. -
Shared authentication infrastructure. - Architecture should allow role
memberships to be extended later. - MVP role registration/access remains
simpler. - Avoid creating incompatible identity systems that make Phase
2 multi-role support impossible.

## Decision 068 --- Pre-appointment reminders

**Question/theme:** How early should a patient be reminded before a
session?

**Decision: One reminder, one hour before the scheduled session.** -
In-app and push notification. - No 24-hour reminder. - No
patient-configurable reminder schedule in MVP.

## Decision 069 --- Token grace period

**Question/theme:** How long should staff wait after calling a token
before marking the patient skipped?

**Decision: 3 minutes.** - Staff waits 3 minutes after calling the
patient. - Staff can then mark patient `SKIPPED`. - Appointment is not
automatically cancelled. - Staff/doctor retains control over
reinstatement.

------------------------------------------------------------------------

# 4. Questions Recognized as Already Covered

During the final part of discovery, several proposed questions were
correctly identified by the user as repeats: - Doctor profile editing
and credential verification were already covered by Decisions 026 and
027. - No-show/skipped patient handling was already covered by Decision
018. - Grace period was a genuinely missing detail and became Decision
069. - The booking window and live booking deadline were already covered
by Decisions 019 and 053. - Physical arrival/check-in was already
resolved by Decisions 003 and 021.

Do not reopen settled decisions without a concrete contradiction or new
requirement.

------------------------------------------------------------------------

# 5. Important Product Rules and Distinctions

These rules should remain visible during technical design:

1.  **Token number ≠ queue position.** Token remains fixed; position
    changes.
2.  **Appointment status ≠ queue status.** `SKIPPED` is a queue state,
    not automatic cancellation.
3.  **Booking window ≠ consultation duration.** Booking can close at 10
    PM while consultations continue later.
4.  **Scheduled start ≠ doctor arrival ≠ actual session start.** These
    are separate events.
5.  **Doctor verification ≠ establishment verification ≠ association
    approval.**
6.  **Doctor profile ≠ doctor-establishment association.** Fees,
    schedule and capacity can be location-specific.
7.  **Physical arrival does not equal check-in.** No mandatory patient
    arrival tracking.
8.  **Over-capacity request ≠ confirmed booking.** No active token until
    approved.
9.  **Cancellation does not recycle token numbers.**
10. **Notification failure must not undo a successful booking.**
11. **A session is manually closed.** Never auto-close merely because
    the scheduled booking window ended.
12. **No substitute doctor is assigned automatically.**
13. **Offline payment is MVP; online payment is Phase 2.**
14. **Multi-role switching is Phase 2; shared identity architecture
    should be future-compatible.**

------------------------------------------------------------------------

# 6. MVP Versus Phase 2

## MVP --- Core vertical slice

The MVP should prove the central product promise end to end.

### Patient

-   Mobile OTP authentication.
-   Basic patient profile.
-   Doctor/establishment discovery.
-   Basic search and filters.
-   Doctor and establishment profile.
-   Session availability.
-   Advance and live booking.
-   Sequential token assignment.
-   Appointment confirmation.
-   Upcoming/active/history dashboard.
-   Live queue tracking.
-   Cancellation.
-   In-app and push notifications.
-   One-hour appointment reminder.

### Doctor

-   Registration and profile.
-   Credential submission.
-   Basic verification workflow.
-   Establishment association.
-   Schedule/session creation.
-   Capacity proposal.
-   Appointment list.
-   Queue management.
-   Session start/end/cancellation.

### Establishment

-   Owner registration.
-   Establishment profile and document submission.
-   Verification workflow.
-   Doctor association approval.
-   Schedule and capacity approval.
-   Basic appointment operations.

### Super Admin

-   Secure login.
-   Doctor and establishment verification.
-   Basic user management.
-   Complaint/review moderation.
-   Support ticket management.
-   Audit log visibility for sensitive actions.

### Platform

-   Shared authentication and server-side role authorization.
-   MongoDB persistence.
-   Socket.IO queue updates.
-   Notification infrastructure.
-   Basic analytics.
-   Validation and error handling.
-   Tests for booking, queue, and session workflows.
-   Deployment.

## MVP Priority 1 --- Add only if time permits

-   Multiple patient profiles.
-   Booking for someone else.
-   Favourites.
-   PDF ticket.
-   Rescheduling.
-   Over-capacity requests.
-   Support ticket image attachments.
-   Basic offline collection recording.
-   Basic analytics.
-   Account deletion.

## Phase 2

-   Multi-role account switching.
-   Advanced medical records/history.
-   Prescription management.
-   Telemedicine.
-   Advanced recommendations and search.
-   Advanced analytics.
-   Online payments (Razorpay), refunds, reconciliation.
-   QR appointment verification.
-   Estimated waiting time.
-   Configurable turn-approaching alerts.
-   Advanced queue pause/resume.
-   Full staff roles, invitations, granular permissions,
    cross-establishment access.
-   SMS, WhatsApp, email notifications.
-   Advanced fraud detection and distributed job processing.
-   Live chat.

------------------------------------------------------------------------

# 7. Open Questions and Deferred Details

These were not finalized and must not be represented as confirmed
requirements:

  -----------------------------------------------------------------------
  Area                                Status
  ----------------------------------- -----------------------------------
  Staff account model, roles,         Drafted / not finalized
  invitation and approval             

  Staff access across multiple        Not finalized
  establishments                      

  Queue pause/resume permissions and  Drafted / not finalized
  workflow                            

  Estimated waiting time algorithm    Deferred

  Exact turn-approaching alert        Not finalized
  trigger                             

  Cancellation cutoff once a token is Needs implementation rule
  called                              

  Whether over-capacity requests can  Needs clarification
  be approved after booking closes    

  Independent clinic capacity         Needs final rule
  approval                            

  Exact Indian establishment          Requires current regulatory
  verification documents              research

  OTP vendor/provider and pricing     Technical selection pending

  Secure account recovery workflow    Needs security design

  Notification retention policy       Deferred

  Exact queue advancement workflow    Technical workflow to finalize
  after consultation completion       

  Whether manual additions after      Technical detail to decide
  booking close need a distinct       
  appointment source/type             

  Appointment and queue enum          Technical design pending
  definitions                         
  -----------------------------------------------------------------------

------------------------------------------------------------------------

# 8. PRD and Execution Handover

The product discovery phase is officially closed.

A PRD v1.0 was drafted in the preceding conversation. It covers: -
Executive summary and problem statement. - Product objectives and
non-goals. - User roles. - Discovery and booking. - Token and queue
workflows. - Session lifecycle. - Doctor/establishment management. -
Patient profiles and history. - Notifications and authentication. -
Reviews, complaints, support. - Analytics. - MVP and Phase 2. - Proposed
technical direction. - Core data domains. - Non-functional
requirements. - MVP acceptance criteria. - Risks and constraints.

## Next conversation instruction

Start the next conversation with:

> **"PRD is finalized. Let's begin execution. First, review the PRD and
> create our 16-day development roadmap."**

The next phase should: 1. Review the PRD and this decision log. 2.
Resolve only implementation-blocking ambiguities. 3. Define a realistic
16-day vertical-slice roadmap. 4. Design database models and
relationships. 5. Define API contracts and backend architecture. 6. Plan
frontend portal structure. 7. Start implementation only after the first
vertical slice is clearly scoped.

## Critical reminder

The full Doctor product is much larger than a one-month solo build. Do
not attempt every listed feature in the first release. Build a reliable,
demonstrable end-to-end workflow first.

**Discovery: CLOSED**\
**Decision log: RECORDED**\
**PRD v1.0: DRAFTED**\
**Development: NOT STARTED**
