import java.sql.Connection;
import java.sql.DriverManager;
import java.sql.SQLException;
import java.util.Timestamp;
import models.Event;


/**
 * author: gracey715
 */
@WebServlet(name = "CloudSQL",
    description = "CloudSQL: Operations on event table in Cloud SQL",
    urlPatterns = "/cloudsql")
public class eventQueries {
	Connection conn;

	/**
	 * Inserts a new row into the event table based on Event object
	 */
	private void insertEvent(Event event) {
		String query = "INSERT INTO event(restaurant_id, time_joined, time_served, party_size, position) VALUES (?, ?, ?, ?, ?)";

		try (Connection conn = connection();
			PreparedStatement pstmt = conn.prepareStatement(SQL)) {
			pstmt.setString(1, event.getRestaurant().getName());
			pstmt.setObject(2, event.getTimeJoined());
			pstmt.setObject(3, event.getTimeServed());
			pstmt.setInt(4, event.getPartySize());
			pstmt.setInt(5, event.getPosition());
			pstmt.executeUpdate();
			pstmt.close();

		} catch (SQLException e) {
			log(e.getMessage());
		}
	}


	/**
	 * Selects events that started within a time range 
	 */
	private List<Event> selectByTime(Timestamp start, Timestamp end) {
		List<Event> result = new ArrayList<>();
		String query = "SELECT * FROM event WHERE time_joined >= ? AND time_joined <= ?";

		try (Connection conn = connection();
			PreparedStatement pstmt = conn.prepareStatement(SQL)) {
			pstmt.setObject(1, start);
			pstmt.setObject(2, end);
			ResultSet rs = pstmt.executeQuery(query);

			while (rs.next()) {
				Event event = new Event();
				event.setId(rs.getInt(1));
				event.setRestaurant()
				event.setTimeJoined(rs.getObject(3));
				result.add(event);
			}
		} catch (SQLException e) {
			log(e.getMessage());
		}
		return result;
	}


	/**
	 * Selects events by restaurant name
	 */
	// private List<Event> selectByRestaurant(String restaurantName) {
	// 	List<Event> result = new ArrayList<>();
	// }

	/**
	 * Update the time_served field when guest is served
	 */ 
	private void updateTimeServed(Timestamp served) {
		String query = "UPDATE event SET time_served = ? WHERE "
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