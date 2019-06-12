import { mount, createLocalVue } from '@vue/test-utils'
import Footer from '../../src/components/Footer.vue'
import Quasar, { QBtn }from 'quasar'

describe('Render, build and wire up a Footer Component', () => {
  const localVue = createLocalVue();
  localVue.use( Quasar, { components:['QBtn']});
  const wrapper = mount(Footer, {
    localVue
  });
  it('passes the sanity check and creates a wrapper', () => {
    expect(wrapper.isVueInstance()).toBe(true)
  });
});
