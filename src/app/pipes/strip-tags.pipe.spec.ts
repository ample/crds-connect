import { StripTagsPipe } from './strip-tags.pipe';

describe('StripTagsPipe', () => {

  let pipe: StripTagsPipe;

  beforeEach(() => {
    pipe = new StripTagsPipe();
  });

  it('Should return plain text with no html tags', () => {
    expect(pipe.transform('<p class="paragraph">Lorem Ipsum is simply dummy text of the printing...</p>')).toEqual('Lorem Ipsum is simply dummy text of the printing...');
  });

  it('Should return the input if its not a string', () => {
    expect(pipe.transform(<any>2)).toEqual(2);
  });
});
