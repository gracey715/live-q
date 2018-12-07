import models.Customer;

public class RestaurantRecord {

	private String name;
	private int customer;
	private int partySize;

	public RestaurantRecord() {
	}

	public void setName(String name) {
		this.name = name;
	}

	public String getName() {
		return name;
	}

	public void setCustomer(int customer) {
		this.customer = customer;
	}

	public int getCustomer() {
		return customer;
	}

	public void setPartySize(int partySize) {
		this.partySize = partySize;
	}

	public int getPartySize() {
		return partySize;
	}

}
