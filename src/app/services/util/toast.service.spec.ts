import { TestBed } from '@angular/core/testing';
import { HotToastService } from '@ngxpert/hot-toast';
import { ToastService } from './toast.service';

describe('ToastService', () => {
    const hotToast = { close: vi.fn(), show: vi.fn(), success: vi.fn(), error: vi.fn(), loading: vi.fn(), warning: vi.fn(), info: vi.fn() };
    let service: ToastService;

    beforeEach(() => {
        Object.values(hotToast).forEach((mock) => mock.mockClear());
        TestBed.configureTestingModule({ providers: [{ provide: HotToastService, useValue: hotToast }] });
        service = TestBed.inject(ToastService);
    });

    it.each(['success', 'error', 'loading', 'warning', 'info'] as const)('routes %s() to the matching toast type', (type) => {
        service[type]('message');
        expect(hotToast[type]).toHaveBeenCalledTimes(1);
        expect(hotToast[type].mock.calls[0][0]).toBe('message');
        expect(hotToast.close).toHaveBeenCalled();
    });

    it('keeps error toasts open for a minute and lets the user dismiss them', () => {
        service.error('failed');
        expect(hotToast.error.mock.calls[0][1]).toMatchObject({ duration: 60_000, dismissible: true });
    });

    it('open() uses the given duration and falls back to a plain toast without a type', () => {
        service.open('hello', true, 1234);
        expect(hotToast.show).toHaveBeenCalledWith('hello', expect.objectContaining({ duration: 1234, dismissible: true }));
        expect(hotToast.close).not.toHaveBeenCalled();
    });
});
