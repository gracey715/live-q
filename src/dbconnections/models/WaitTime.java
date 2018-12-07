public class WaitTime {

	private String restaurant;
	private int position;
	private int partySize;
	private int estimatedWait;

	public WaitTime() {
	}

	public void setRestaurant(String restaurant) {
		this.restaurant = restaurant;
	}

	public String getRestaurant() {
		return restaurant;
	}

	public void setPosition(int position) {
		this.position = position;
	}

	public int getPosition() {
		return position;
	}

	public void setPartySize(int partySize) {
		this.partySize = partySize;
	}

	public int getPartySize() {
		return partySize;
	}

	public void setEstimatedWait(int estimatedWait) {
		this.estimatedWait = estimatedWait;
	}

	public int getEstimatedWait() {
		return estimatedWait;
	}
}