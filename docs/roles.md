# Roles and access

In the live product nobody switches roles. Access is granted by the system owner and by administrators acting under that account. A person can lead one team and be a member of another. My Teams shows the leader view or the member view for each team they are on.

The prototype bar is labeled prototype-only. It has four views so a reviewer can see each grant:

| View as | Fake person | What it stands for |
|---|---|---|
| Employee | Nadia Reyes | A member of Insurance |
| Leader | Omar Hale | Leads Insurance, and is a member of Operations |
| Administrator | Amina Farouk | Manages people, teams, and access. Not the owner |
| George | georgehariri@gmail.com | George's day-to-day account |

## Two George accounts

| Account | Email | What it is |
|---|---|---|
| System owner | george@hariribusinessservices.com | The single top-level account. Shown locked on Manage access. This email is the only place that domain appears. |
| George | georgehariri@gmail.com | The personal account behind View as: George. His workday, reviews, company, decisions, and system. |

The system owner can grant and revoke Administrator, Leader, and Employee, sees everything, and cannot be removed or demoted by anyone else. Other administrators act under it. They cannot change the system owner, cannot change George's personal account, and cannot grant or revoke Administrator.

## What each role can see and do

| | Employee | Leader | Administrator | George (personal) | System owner |
|---|---|---|---|---|---|
| Own My Workday, Growth, Communication, Review, Use AI, Calendar, Meetings | Yes | Yes | Yes | Yes | Not a daily login |
| Growth for other people | Own record | Teams they lead | Everyone | Everyone | Yes |
| My Teams, member view | Teams they belong to | Teams they only belong to | Teams they only belong to | If assigned | No |
| My Teams, leader view | No | Teams they lead | Teams they lead | If assigned | No |
| Company, Decisions, System | No | No | No | Yes | Yes |
| Assign people to teams, set leader or member | No | No | Yes, except the two locked accounts | View only | Yes |
| Grant or revoke Administrator | No | No | No | No | Yes |
| Remove or demote the system owner | No | No | No | No | No |
| Own daily check-in | Yes | Yes | Yes | Yes | Not a daily login |
| Team check-in completion | No | Teams they lead | Teams they lead | Company, on Company | Yes |
| AI usage vs output | Own row | Teams they lead | Everyone | Everyone | Yes |
| Change primary or backup model | No | No | Yes | Yes | Yes |

Execution rate stays private to the person, their leader, and George. It is never a ranking. Time Doctor hours on My Teams are for the leader of that team, not a scoreboard.
