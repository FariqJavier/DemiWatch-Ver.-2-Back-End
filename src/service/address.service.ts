import Address from '../models/address.model';

class AddressService {

  async createHomeAddress(data: {
    address_id: string;
    patient_id: string;
    address_type: 'HOME';
    address_name: string;
    latitude: Int16Array;
    longitude: Int16Array;
  }): Promise<Address> {
    try {
      const address = await Address.create(data);
      return address;
    } catch (error) {
      throw new Error(`Failed to create Home Address: ${error}`);
    }
  }

  async createDestinationAddress(data: {
    address_id: string;
    patient_id: string;
    address_type: 'DESTINATION';
    address_name: string;
    latitude: Int16Array;
    longitude: Int16Array;
  }): Promise<Address> {
    try {
      const address = await Address.create(data);
      return address;
    } catch (error) {
      throw new Error(`Failed to create Destination Address: ${error}`);
    }
  }

  async getAllHomeAddressByPatientId(id: string): Promise<Address[] | null> {
    try {
      const address = await Address.findAll({ 
        where: {
          patient_id: id,
          address_type: 'HOME'
        } 
      });

      return address;
    } catch (error) {
      throw new Error(`Failed to get all Home Address for Patient: ${error}`);
    }
  }

  async getAllDestinationAddressByPatientId(id: string): Promise<Address[] | null> {
    try {
      const address = await Address.findAll({ 
        where: {
          patient_id: id,
          address_type: 'DESTINATION'
        } 
      });

      return address;
    } catch (error) {
      throw new Error(`Failed to get all Destination Address for Patient: ${error}`);
    }
  }

  async getAddressById(patient_id: string, address_id: string): Promise<Address | null> {
    try {
      const address = await Address.findOne({
        where: {
            address_id: address_id,
            patient_id: patient_id
        }
      })
      return address;
    } catch (error) {
      throw new Error(`Failed to get Address ID: ${error}`);
    }
  }

  async updateAddressByAddressId(patient_id: string, address_id: string, data: {
    address_name?: string;
    latitude?: Int16Array;
    longitude?: Int16Array;
  }): Promise<[number, Address[]]> {
    try {
      const [updatedRows, updatedAddress] = await Address.update(data, {
        where: {
            address_id: address_id,
            patient_id: patient_id
        },
        returning: true,
      });
      return [updatedRows, updatedAddress];
    } catch (error) {
      throw new Error(`Failed to update Address by Id: ${error}`);
    }
  }

  async deleteAddressById(id: string): Promise<number> {
    try {
      const deletedRows = await Address.destroy({ where: { address_id: id } });
      return deletedRows;
    } catch (error) {
      throw new Error(`Failed to delete Address ID: ${error}`);
    }
  }
}

export default AddressService;