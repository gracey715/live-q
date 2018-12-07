import java.sql.Timestamp;

public class Event {

	private int id;
	private Timestamp timeJoined;
	private Timestamp timeServed;
	private String restaurant;
	private int partySize;
	private int position;

	public Event() {
	}

	public void setId(int id) {
		this.id = id;
	}

	public int getId() {
		return id;
	}

	public void setTimeJoined(Timestamp timeJoined) {
		this.timeJoined = timeJoined;
	}

	public Timestamp getTimeJoined() {
		return timeJoined;
	}

	public void setTimeServed(Timestamp timeServed) {
		this.timeServed = timeServed;
	}

	public Timestamp getTimeServed() {
		return timeServed;
	}

	public void setRestaurant(String restaurant) {
		this.restaurant = restaurant;
	}

	public String getRestaurant() {
		return restaurant;
	}

	public void setPartySize(int partySize) {
		this.partySize = partySize;
	}

	public int getPartySize () {
		return partySize;
	}

	public void setPosition(int position) {
		this.position = position;
	}

	public int getPosition() {
		return position;
	}
}
