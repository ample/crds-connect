import { PinLabel, PinLabelData } from './pin-label-data';
import { pinType } from './pin';


describe('FancyService without the TestBed', () => {

  let pinLabelData: PinLabelData;
  let gatheringLabelData: PinLabelData;
  let siteLabelData: PinLabelData;

  beforeEach(() => {
    pinLabelData = new PinLabelData('Bobby', 'R.', '', false, false, pinType.PERSON);
    siteLabelData = new PinLabelData('', '', 'Some Site', false, false, pinType.SITE);
    gatheringLabelData = new PinLabelData('Bobby', 'R.', '', true, false, pinType.GATHERING);
  });

  it('Should set line 1 to name', () => {
    let pinLabel: PinLabel = new PinLabel(pinLabelData);
    expect(pinLabel.line1).toEqual('Bobby R.');
  });

  it('Should set line 1 to site name', () => {
    let pinLabel: PinLabel = new PinLabel(siteLabelData);
    expect(pinLabel.line1).toEqual('Some Site');
  });

  it('Should set line 2 to "HOST"', () => {
    let pinLabel: PinLabel = new PinLabel(gatheringLabelData);
    expect(pinLabel.line2).toEqual('HOST');
  });

});