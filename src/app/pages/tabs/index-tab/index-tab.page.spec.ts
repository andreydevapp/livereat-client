import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { IndexTabPage } from './index-tab.page';

describe('IndexTabPage', () => {
  let component: IndexTabPage;
  let fixture: ComponentFixture<IndexTabPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ IndexTabPage ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(IndexTabPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
