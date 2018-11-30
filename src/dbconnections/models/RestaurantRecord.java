public class RestaurantRecord {

	private String name;
	private int customerId;
	private int partySize;

	public RestaurantRecord() {
	}

	public void setName(String name) {
		this.name = name;
	}

	public String getName() {
		return name;
	}

	public void setCustomerId(int customerId) {
		this.customerId = customerId;
	}

	public int getCustomerId() {
		return customerId;
	}
	
	public void setPartySize(int partySize) {
		this.partySize = partySize;
	}

	public int getPartySize() {
		return partySize;
	}

}
