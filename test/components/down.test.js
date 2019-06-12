import { mount, createLocalVue } from '@vue/test-utils'
import Down from '../../src/components/Down.vue'
import Quasar, { QBtn, QInput } from 'quasar'
describe('Render, build and wire up a quasar component', () => {
  const localVue = createLocalVue();
  localVue.use(Quasar, { components: ['QBtn', 'QInput']});
  const wrapper = mount(Down, {
    localVue
  });

  it('passes the sanity check and creates a wrapper', () => {
    expect(wrapper.isVueInstance()).toBe(true)
  });
});
