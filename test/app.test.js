import { mount, createLocalVue } from '@vue/test-utils'
import App from '../src/App.vue'
describe('Render, build and wire up a quasar component', () => {
  const localVue = createLocalVue();
  const wrapper = mount(App, {
    localVue
  });

  it('passes the sanity check and creates a wrapper', () => {
    expect(wrapper.isVueInstance()).toBe(true)
  });
});
