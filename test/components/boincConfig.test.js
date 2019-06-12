import { mount, createLocalVue } from '@vue/test-utils'
import BoincConfig from '../../src/components/BoincConfig.vue'
import Quasar, { QBtn, QInput } from 'quasar'
describe('Render, build and wire up a quasar component', () => {
  const localVue = createLocalVue();
  localVue.use(Quasar, { components: ['QBtn', 'QInput']});
  const wrapper = mount(BoincConfig, {
    localVue
  });

  it('passes the sanity check and creates a wrapper', () => {
    expect(wrapper.isVueInstance()).toBe(true)
  });
});
