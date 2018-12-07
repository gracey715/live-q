import java.sql.Connection;
import java.sql.DriverManager;
import java.sql.SQLException;
import models.RestaurantRecord;


/**
 * author: gracey715
 */
@WebServlet(name = "CloudSQL",
    description = "CloudSQL: Operations on wait_time table in Cloud SQL",
    urlPatterns = "/cloudsql")
public class waitTimeQueries {
	Connection conn;

	/**
	 * Gets the estimated wait time for a certain position in line.
	 */
	private int getAvgWaitTimesForPartySize(int position) {
		String query = "SELECT avg(estimated_wait) FROM wait_times WHERE position = ?";
		int average;

		try (Connection conn = connection();
			PreparedStatement pstmt = conn.prepareStatement(SQL)) {
			pstmt.setInt(1, position);
			ResultSet rs = pstmt.executeQuery(query);

			while (rs.next()) {
				average = rs.getInt(1);
			}

		} catch (SQLException e) {
			log(e.getMessage());
		}
		pstmt.close();
		return average;
	}

	/**
	 * Updates the estimated wait time for a given position in line.
	 */ 
	private void updateWaitTime(int updatedTime, int position) {
		String query = "UPDATE wait_times SET estimated_wait = ? WHERE position = ?";

		try (Connection conn = connection();
			PreparedStatement pstmt = conn.prepareStatement(SQL)) {
			pstmt.setInt(1, updatedTime);
			pstmt.setInt(2, position);
			pstmt.executeUpdate();

		} catch (SQLException e) {
			log(e.getMessage());
		}
		pstmt.close();
	}


	public void init() throws ServletException {
		String url = System.getProperty("cloudsql");
		log("Connecting to: " + url);
		try {
			conn = DriverManager.getConnection(url);
		} catch (SQLException e) {
			throw new ServletException("Unable to connect to Cloud SQL", e);
		}
	}
}