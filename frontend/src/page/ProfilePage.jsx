import { React, useEffect } from "react";
import { Link } from "react-router-dom";
import { ArrowLeft, Swords, Hourglass } from "lucide-react";
import { useAuthStore } from "../store/useAuthStore";
import ProfileSubmission from "../components/ProfileSubmission";
import ProblemSolvedByUser from "../components/ProblemSolvedByUser";
import PlaylistProfile from "../components/PlaylistProfile";
import { useSubmissionStore } from "../store/useSubmissionStore";

const Profile = () => {
  const { authUser } = useAuthStore();
  const { allSubmissionsOfUser, getAllSubmissions } = useSubmissionStore();

  // time tracking
  const today = new Date();
  const format = (date) => date.toISOString().split("T")[0];

  const todayKey = `track-${format(today)}`;

  const yesterday = new Date(today);
  yesterday.setDate(today.getDate() - 1);
  const yesterdayKey = `track-${format(yesterday)}`;

  const todayMinutes = parseInt(localStorage.getItem(todayKey) || "0", 10);
  const yesterdayMinutes = parseInt(
    localStorage.getItem(yesterdayKey) || "0",
    10,
  );

  console.log("today minutes", todayMinutes);
  console.log("yesterday minutes", yesterdayMinutes);

  // TODO: server side tracking of time spent
  const percent =
    yesterdayMinutes === 0
      ? todayMinutes > 0
        ? 100
        : 0
      : (todayMinutes / yesterdayMinutes) * 100;

  const timePercent = Math.round(percent);

  console.log("this is the time percent", timePercent);

  useEffect(() => {
    getAllSubmissions();
  }, [getAllSubmissions]);

  const acceptedSubmission = allSubmissionsOfUser.filter(
    (s) => s.status === "Accepted",
  );

  const successRateOfUser = allSubmissionsOfUser.length
    ? (acceptedSubmission.length / allSubmissionsOfUser.length) * 100
    : 0;

  return (
    <div className="min-h-screen bg-base-200 flex flex-col items-center justify-center py-10 px-4 md:px-8 w-full">
      {/* Header with back button */}
      <div className="flex flex-row justify-between items-center w-full mb-6">
        <div className="flex items-center gap-3">
          <Link to={"/"} className="btn btn-circle btn-ghost">
            <ArrowLeft className="w-5 h-5" />
          </Link>
          <h1 className="text-3xl font-bold text-primary">Profile</h1>
        </div>
      </div>

      <div className="w-full max-w-4xl mx-auto">
        {/* Profile Card */}
        <div className="card bg-base-100 shadow-xl">
          <div className="card-body">
            <div className="stats stats-shadow stats-vertical md:stats-horizontal w-full justify-center">
              <div className="stat">
                <div className="stat-figure content-primary">
                  <Hourglass className="h-8 w-8" />
                </div>
                <div className="stat-title">Time Spent</div>
                <div className="stat-value content-primary">
                  {todayMinutes} min
                </div>
                <div className="stat-desc">
                  {timePercent}% more than yesterday
                </div>
              </div>
              <div className="stat">
                <div className="stat-figure content-secondary">
                  <Swords className="h-8 w-8" />
                </div>
                <div className="stat-title">Challenge Taken</div>
                <div className="stat-value content-secondary">
                  {allSubmissionsOfUser.length}
                </div>
                {/* TODO: fetch problems solved by user in last month */}
                <div className="stat-desc">100% more than last month</div>
              </div>
              <div className="stat">
                <div className="stat-figure content-secondary flex flex-col items-center">
                  <div className="avatar ">
                    <div className="w-16 rounded-full">
                      <img
                        src={`https://i.pravatar.cc/150?u=${authUser?.id}`}
                      />
                    </div>
                  </div>
                  {/* <div>{authUser.name}</div> */}
                </div>
                <div className="stat-title">Success Rate</div>
                <div className="stat-value">{successRateOfUser}%</div>
                <div className="stat-desc ">
                  {acceptedSubmission.length} Successful Attempts
                </div>
              </div>
            </div>
            {/* TODO: graph implementation here  */}
            {/* <div className="divider"></div> */}
          </div>
        </div>
        <div>
          <ProfileSubmission />

          <ProblemSolvedByUser />

          <PlaylistProfile />
        </div>

        {/* PLaylist created by the user and their actions */}
      </div>
    </div>
  );
};

export default Profile;
