import models.Customer;

public class RestaurantRecord {

	private String name;
	private Customer customer;
	private int partySize;

	public RestaurantRecord() {
	}

	public void setName(String name) {
		this.name = name;
	}

	public String getName() {
		return name;
	}

	public void setCustomer(Customer customer) {
		this.customer = customer;
	}

	public Customer getCustomer() {
		return customer;
	}

	public void setPartySize(int partySize) {
		this.partySize = partySize;
	}

	public int getPartySize() {
		return partySize;
	}

}
