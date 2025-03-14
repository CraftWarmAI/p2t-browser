export function hrefChange(fn: (href?: string) => void, durable = false) {
    let href = location.href;
    const timer = setInterval(() => {
        const newHref = location.href;
        if (newHref !== href) {
            fn(newHref);
            if (!durable) {
                clearInterval(timer);
            }
            href = newHref;
        }
    }, 200);
}
