import { IMainScreenForm } from '../interfaces/IMainScreenForm';

class MainScreenForm implements IMainScreenForm {
  [key: string]: any;

  public from: string;
  public to: string;
  public flyOut: Date;
  public flyBack: Date;
  public ammountOfPassengers: number;

  constructor() {
    this.from = '';
    this.to = '';
    this.flyOut = new Date();
    this.flyBack = new Date();
    this.ammountOfPassengers = 0;
  }
}

export default MainScreenForm;
