import java.sql.Connection;
import java.sql.DriverManager;
import java.sql.SQLException;
import models.RestaurantRecord;


/**
 * author: gracey715
 */
@WebServlet(name = "CloudSQL",
    description = "CloudSQL: Operations on restaurant table in Cloud SQL",
    urlPatterns = "/cloudsql")
public class restaurantQueries {
	Connection conn;

	private void insertRecord(RestaurantRecord record) {
		String query = "INSERT INTO restaurant(restaurant_id, customer_id, party_size) VALUES (?, ?, ?)";

		try (Connection conn = connection();
			PreparedStatement pstmt = conn.prepareStatement(SQL)) {

			pstmt.setString(1, record.getName());
			pstmt.setInt(2, record.getCustomer().getId());
			pstmt.setInt(3, record.getPartySize());
			pstmt.executeUpdate();
			pstmt.close();

		} catch (SQLException e) {
			log(e.getMessage());
		}
	}

	/**
	 * Get the records for a specific restaurant (by name)
	 */
	private List<RestaurantRecord> selectRecords(String restaurantName) {
		String query = "SELECT * FROM restaurant WHERE restaurant_id = ?";
		List<RestaurantRecord> result = new ArrayList<>();

		try (Connection conn = connection();
			PreparedStatement pstmt = conn.prepareStatement(SQL)) {

			pstmt.setString(1, restaurantName);
			ResultSet rs = pstmt.executeQuery(query);

			while (rs.next()) {
				RestaurantRecord rec = new RestaurantRecord();
				rec.setName(rs.getString(1));
				rec.setPartySize(rs.getInt(3));
				result.add(rec);
			}
			pstmt.close();
		}
		return result;
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