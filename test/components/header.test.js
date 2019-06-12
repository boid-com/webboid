import { mount, createLocalVue } from '@vue/test-utils'
import Header from '../../src/components/Header.vue'
describe('Render, build and wire up a Header Component', () => {
  const localVue = createLocalVue();
  const wrapper = mount(Header, {
    localVue
  });
  it('passes the sanity check and creates a wrapper', () => {
    expect(wrapper.isVueInstance()).toBe(true)
  });
});
