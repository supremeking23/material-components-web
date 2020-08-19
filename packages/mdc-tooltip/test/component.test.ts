/**
 * @license
 * Copyright 2020 Google Inc.
 *
 * Permission is hereby granted, free of charge, to any person obtaining a copy
 * of this software and associated documentation files (the "Software"), to deal
 * in the Software without restriction, including without limitation the rights
 * to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
 * copies of the Software, and to permit persons to whom the Software is
 * furnished to do so, subject to the following conditions:
 *
 * The above copyright notice and this permission notice shall be included in
 * all copies or substantial portions of the Software.
 *
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 * IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 * FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
 * AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
 * LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
 * OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
 * THE SOFTWARE.
 */

import {getFixture} from '../../../testing/dom';
import {emitEvent} from '../../../testing/dom/events';
import {createMockFoundation} from '../../../testing/helpers/foundation';
import {setUpMdcTestEnvironment} from '../../../testing/helpers/setup';
import {AnchorBoundaryType, Position, YPosition} from '../constants';
import {MDCTooltip, MDCTooltipFoundation} from '../index';

function setupTestWithMockFoundation(fixture: HTMLElement) {
  const tooltipElem = fixture.querySelector('#tt0') as HTMLElement;
  const anchorElem = fixture.querySelector('[aria-describedby]') as HTMLElement;
  const mockFoundation = createMockFoundation(MDCTooltipFoundation);
  const component = new MDCTooltip(tooltipElem, mockFoundation);
  return {anchorElem, tooltipElem, mockFoundation, component};
}

describe('MDCTooltip', () => {
  let fixture: HTMLElement;
  setUpMdcTestEnvironment();

  beforeEach(() => {
    fixture = getFixture(`<div>
        <button aria-describedby="tt0">
          anchor
        </button>
        <div id="tt0" class="mdc-tooltip" aria-role="tooltip" aria-hidden="true">
          <div class="mdc-tooltip__surface">
            demo tooltip
          </div>
        </div>
      </div>`);
    document.body.appendChild(fixture);
  });

  afterEach(() => {
    document.body.removeChild(fixture);
  });

  it('attachTo returns a component instance', () => {
    expect(MDCTooltip.attachTo(
               fixture.querySelector('.mdc-tooltip') as HTMLElement))
        .toEqual(jasmine.any(MDCTooltip));
  });

  it('attachTo throws an error when anchor element is missing', () => {
    const container =
        fixture.querySelector('[aria-describedby]') as HTMLElement;
    container.parentElement!.removeChild(container);
    expect(
        () => MDCTooltip.attachTo(
            container.querySelector('.mdc-tooltip') as HTMLElement))
        .toThrow();
  });

  it('#initialSyncWithDOM registers mouseenter event handler on the anchor element',
     () => {
       const {anchorElem, mockFoundation, component} =
           setupTestWithMockFoundation(fixture);
       emitEvent(anchorElem, 'mouseenter');
       expect(mockFoundation.handleAnchorMouseEnter).toHaveBeenCalled();
       component.destroy();
     });

  it('#destroy deregisters mouseenter event handler on the anchor element',
     () => {
       const {anchorElem, mockFoundation, component} =
           setupTestWithMockFoundation(fixture);
       component.destroy();
       emitEvent(anchorElem, 'mouseenter');
       expect(mockFoundation.handleAnchorMouseEnter).not.toHaveBeenCalled();
     });

  it('#initialSyncWithDOM registers focus event handler on the anchor element',
     () => {
       const {anchorElem, mockFoundation, component} =
           setupTestWithMockFoundation(fixture);
       emitEvent(anchorElem, 'focus');
       expect(mockFoundation.handleAnchorFocus).toHaveBeenCalled();
       component.destroy();
     });

  it('#destroy deregisters focus event handler on the anchor element', () => {
    const {anchorElem, mockFoundation, component} =
        setupTestWithMockFoundation(fixture);
    component.destroy();
    emitEvent(anchorElem, 'focus');
    expect(mockFoundation.handleAnchorFocus).not.toHaveBeenCalled();
  });

  it('#initialSyncWithDOM registers mouseleave event handler on the anchor element',
     () => {
       const {anchorElem, mockFoundation, component} =
           setupTestWithMockFoundation(fixture);
       emitEvent(anchorElem, 'mouseleave');
       expect(mockFoundation.handleAnchorMouseLeave).toHaveBeenCalled();
       component.destroy();
     });

  it('#destroy deregisters mouseleave event handler on the anchor element',
     () => {
       const {anchorElem, mockFoundation, component} =
           setupTestWithMockFoundation(fixture);
       component.destroy();
       emitEvent(anchorElem, 'mouseleave');
       expect(mockFoundation.handleAnchorMouseLeave).not.toHaveBeenCalled();
     });

  it('#initialSyncWithDOM registers blur event handler on the anchor element',
     () => {
       const {anchorElem, mockFoundation, component} =
           setupTestWithMockFoundation(fixture);
       emitEvent(anchorElem, 'blur');
       expect(mockFoundation.handleAnchorBlur).toHaveBeenCalled();
       component.destroy();
     });

  it('#destroy deregisters blur event handler on the anchor element', () => {
    const {anchorElem, mockFoundation, component} =
        setupTestWithMockFoundation(fixture);
    component.destroy();
    emitEvent(anchorElem, 'blur');
    expect(mockFoundation.handleAnchorBlur).not.toHaveBeenCalled();
  });

  it('#initialSyncWithDOM registers transitionend event handler on the tooltip',
     () => {
       const {mockFoundation, component} = setupTestWithMockFoundation(fixture);
       emitEvent(component.root, 'transitionend');
       expect(mockFoundation.handleTransitionEnd).toHaveBeenCalled();
       component.destroy();
     });

  it('#destroy deregisters transitionend event handler on the tooltip', () => {
    const {mockFoundation, component} = setupTestWithMockFoundation(fixture);
    component.destroy();
    emitEvent(component.root, 'transitionend');
    expect(mockFoundation.handleTransitionEnd).not.toHaveBeenCalled();
  });

  it('#setTooltipPosition fowards to MDCFoundation#setTooltipPosition', () => {
    const {mockFoundation, component} = setupTestWithMockFoundation(fixture);
    component.setTooltipPosition(
        {xPos: Position.CENTER, yPos: YPosition.ABOVE});
    expect(mockFoundation.setTooltipPosition)
        .toHaveBeenCalledWith({xPos: Position.CENTER, yPos: YPosition.ABOVE});
    component.destroy();
  });

  it('#setAnchorBoundaryType fowards to MDCFoundation#setAnchorBoundaryType',
     () => {
       const {mockFoundation, component} = setupTestWithMockFoundation(fixture);
       component.setAnchorBoundaryType(AnchorBoundaryType.UNBOUNDED);
       expect(mockFoundation.setAnchorBoundaryType)
           .toHaveBeenCalledWith(AnchorBoundaryType.UNBOUNDED);
       component.destroy();
     });
});
