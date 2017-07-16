import * as listduck from '../CookbookList/CookbookListDuck';
import * as apiduck from '../Api/apiDuck';

describe('CookbookList reducer', () => {
  it('should return initial state', () => {
    expect(listduck.cookbookListReducer(undefined, { type: '', payload: '' }))
      .toEqual(new listduck.INITIAL_STATE);
  });

  it('should handle OPEN_NEW_COOKBOOK_DIALOG', () => {
    const nextState = listduck.cookbookListReducer(new listduck.INITIAL_STATE, listduck.openNewCookbookDialog());
    expect(nextState.get('newCookbookDialogOpen')).toBeTruthy();
  });

  it('should handle CLOSE_NEW_COOKBOOK_DIALOG', () => {
    const nextState = listduck.cookbookListReducer(new listduck.INITIAL_STATE, listduck.closeNewCookbookDialog());
    expect(nextState.get('newCookbookDialogOpen')).toBeFalsy();
  });

  it('should handle LIST_COOKBOOKS.SUCCESS', () => {
    const nextState = listduck.cookbookListReducer(new listduck.INITIAL_STATE, apiduck.listCookbooks.success({ body: { data: 'success' } }));
    expect(nextState.get('result')).toBeTruthy();
    expect(nextState.get('loading')).toBeFalsy();
  });

  it('should handle LIST_COOKBOOKS.FAILURE', () => {
    const nextState = listduck.cookbookListReducer(new listduck.INITIAL_STATE, apiduck.listCookbooks.failure());
    expect(nextState.get('result')).toBeFalsy();
    expect(nextState.get('loading')).toBeFalsy();
  });
});
