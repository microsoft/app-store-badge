//**
 * @license
 * Copyright 2021 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */

import path from 'path';
import fs from 'fs';

const ROOT_DIR = process.cwd();

const BUILD_DIR = path.resolve(ROOT_DIR, 'build');
const SRC_DIR = path.resolve(ROOT_DIR, 'src');

const IMAGE_DIR = path.resolve(SRC_DIR, 'images');

const ALLOWED_IMAGE_EXTENSIONS = new Set([
    '.png',
    '.jpg',
    '.jpeg',
    '.gif',
    '.svg',
    '.webp',
    '.ico'
]);

function safeDecode(url = '') {
    try {
        return decodeURIComponent(url);
    } catch {
        return null;
    }
}

function isSafeRequest(url = '') {

    if (typeof url !== 'string') {
        return false;
    }

    const decoded = safeDecode(url);

    if (decoded === null) {
        return false;
    }

    return !(
        decoded.includes('..') ||
        decoded.includes('\0') ||
        decoded.includes('\\') ||
        decoded.includes('%2e') ||
        decoded.includes('%5c') ||
        decoded.includes('%00')
    );
}

function isFingerprintAsset(file = '') {
    return /\.[a-f0-9]{8,}\./i.test(file);
}

function isPathInside(parent, target) {

    const relative = path.relative(parent, target);

    return (
        relative &&
        !relative.startsWith('..') &&
        !path.isAbsolute(relative)
    );
}

function setSecurityHeaders(context) {

    context.set('X-Content-Type-Options', 'nosniff');

    context.set(
        'Referrer-Policy',
        'strict-origin-when-cross-origin'
    );

    context.set(
        'Permissions-Policy',
        'camera=(), microphone=(), geolocation=()'
    );

    context.set(
        'Cross-Origin-Resource-Policy',
        'same-origin'
    );

    context.set(
        'Cross-Origin-Opener-Policy',
        'same-origin'
    );

    context.set(
        'X-Frame-Options',
        'SAMEORIGIN'
    );

    context.set(
        'Content-Security-Policy',
        [
            "default-src 'self'",
            "script-src 'self'",
            "style-src 'self'",
            "img-src 'self' data:",
            "font-src 'self'",
            "connect-src 'self'",
            "frame-src 'self'",
            "object-src 'none'",
            "base-uri 'self'",
            "form-action 'self'",
            "frame-ancestors 'self'"
        ].join('; ')
    );
}

function setStaticCacheHeaders(context, file = '') {

    if (isFingerprintAsset(file)) {

        context.set(
            'Cache-Control',
            'public, max-age=31536000, immutable'
        );

        return;
    }

    context.set(
        'Cache-Control',
        'public, max-age=3600'
    );
}

function setMimeType(context, file = '') {

    if (file.endsWith('.js')) {
        context.type = 'application/javascript';
        return;
    }

    if (file.endsWith('.js.map')) {
        context.type = 'application/json';
        return;
    }

    if (file.endsWith('.png')) {
        context.type = 'image/png';
        return;
    }

    if (
        file.endsWith('.jpg') ||
        file.endsWith('.jpeg')
    ) {
        context.type = 'image/jpeg';
        return;
    }

    if (file.endsWith('.svg')) {
        context.type = 'image/svg+xml';
        return;
    }

    if (file.endsWith('.webp')) {
        context.type = 'image/webp';
        return;
    }

    if (file.endsWith('.gif')) {
        context.type = 'image/gif';
        return;
    }

    if (file.endsWith('.ico')) {
        context.type = 'image/x-icon';
    }
}

function requestLogger(context, next) {

    const started = Date.now();

    return next().then(() => {

        const duration = Date.now() - started;

        console.log(JSON.stringify({
            ts: new Date().toISOString(),
            method: context.method,
            url: context.url,
            status: context.status,
            duration
        }));
    });
}

export default {

    nodeResolve: true,

    preserveSymlinks: false,

    rootDir: '.',

    appIndex: 'src/index.html',

    open: '/',

    middleware: [

        function securityMiddleware(context, next) {

            setSecurityHeaders(context);

            if (!isSafeRequest(context.url)) {

                context.status = 400;
                context.body = 'Bad Request';

                return;
            }

            return next();
        },

        requestLogger,

        function serveRoot(context, next) {

            if (
                context.url === '/' ||
                context.url === '/index.html'
            ) {
                context.url = '/src/index.html';
            }

            return next();
        },

        function serveBuildAssets(context, next) {

            const isBuildAsset =
                context.url.endsWith('.js') ||
                context.url.endsWith('.js.map');

            if (!isBuildAsset) {
                return next();
            }

            const requestedFile =
                path.posix.basename(context.url);

            const resolvedPath =
                path.resolve(BUILD_DIR, requestedFile);

            if (
                !isPathInside(BUILD_DIR, resolvedPath)
            ) {

                context.status = 403;
                context.body = 'Forbidden';

                return;
            }

            if (
                fs.existsSync(resolvedPath) &&
                fs.statSync(resolvedPath).isFile()
            ) {

                setStaticCacheHeaders(
                    context,
                    requestedFile
                );

                setMimeType(
                    context,
                    requestedFile
                );

                context.url = `/build/${requestedFile}`;
            }

            return next();
        },

        function serveIframe(context, next) {

            if (context.url === '/iframe.html') {

                const iframePath =
                    path.resolve(
                        SRC_DIR,
                        'iframe.html'
                    );

                if (
                    fs.existsSync(iframePath) &&
                    fs.statSync(iframePath).isFile()
                ) {
                    context.url = '/src/iframe.html';
                }
            }

            return next();
        },

        function serveImages(context, next) {

            if (
                !context.url.startsWith('/images/')
            ) {
                return next();
            }

            const normalizedPath =
                path.posix.normalize(context.url);

            if (
                normalizedPath.includes('..')
            ) {

                context.status = 403;
                context.body = 'Forbidden';

                return;
            }

            const extension =
                path.extname(normalizedPath)
                    .toLowerCase();

            if (
                !ALLOWED_IMAGE_EXTENSIONS.has(extension)
            ) {

                context.status = 415;
                context.body =
                    'Unsupported Media Type';

                return;
            }

            const relativePath =
                normalizedPath.replace(
                    /^\/images\//,
                    ''
                );

            const resolvedImagePath =
                path.resolve(
                    IMAGE_DIR,
                    relativePath
                );

            if (
                !isPathInside(
                    IMAGE_DIR,
                    resolvedImagePath
                )
            ) {

                context.status = 403;
                context.body = 'Forbidden';

                return;
            }

            if (
                !fs.existsSync(resolvedImagePath) ||
                !fs.statSync(resolvedImagePath).isFile()
            ) {

                context.status = 404;
                context.body = 'Not Found';

                return;
            }

            setStaticCacheHeaders(
                context,
                relativePath
            );

            setMimeType(
                context,
                resolvedImagePath
            );

            context.url =
                `/src/images/${relativePath}`;

            return next();
        }
    ]
};
