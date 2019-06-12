import { mount, createLocalVue } from '@vue/test-utils'
import Scatter from '../../src/components/Scatter.vue'
import Quasar, { QBtn, QInput } from 'quasar'
describe('Render, build and wire up a quasar component', () => {
  const localVue = createLocalVue();
  localVue.use(Quasar, { components: ['QBtn', 'QInput']});
  const wrapper = mount(Scatter, {
    localVue
  });

  it('passes the sanity check and creates a wrapper', () => {
    expect(wrapper.isVueInstance()).toBe(true)
  });
});
