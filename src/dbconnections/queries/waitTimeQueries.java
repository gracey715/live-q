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