import AdminMovies from "./AdminMovies";
import UsersChart from "./UserCharts";

export default function AdminPanel() {
  return (
    <>
      <div style={{ padding: "20px" }}>
        <h1>Admin Panel</h1>
        <p>Manage Movies, Users and Review</p>
      </div>

      <AdminMovies />

      <UsersChart />
    </>
  );
}