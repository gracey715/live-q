import java.sql.Connection;
import java.sql.DriverManager;
import java.sql.SQLException;
import models.Customer;

/**
 * author: gracey715
 */
@WebServlet(name = "CloudSQL",
    description = "CloudSQL: Operations on customer table in Cloud SQL",
    urlPatterns = "/cloudsql")
public class customerQueries {
	Connection conn;

	/**
	 * Inserts a new row into the customer table using Customer object
	 */
	private void insertCustomer(Customer customer) {
		String query = "INSERT INTO customer(first_name, last_name) VALUES (?, ?)";

		try (Connection conn = connection();
			PreparedStatement pstmt = conn.prepareStatement(SQL)) {

			pstmt.setString(1, customer.getFirstName());
			pstmt.setString(2, customer.getLastName());
			pstmt.executeUpdate();
			pstmt.close();
		} catch (SQLException e) {
			log(e.getMessage());
		}
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