import gulp from 'gulp';
import inject from 'gulp-inject';
import rename from 'gulp-rename';
import dartSass from 'sass';
import gulpSass from 'gulp-sass';
const sass = gulpSass(dartSass);
import autoprefixer from 'gulp-autoprefixer';
import sourcemaps from "gulp-sourcemaps";
import cleanCSS from "gulp-clean-css";
import {create as bsCreate} from 'browser-sync';
const browserSync = bsCreate();
import gulpClean from 'gulp-clean';
import htmlmin from 'gulp-htmlmin';
import gulpif from 'gulp-if';
import concat from 'gulp-concat';
import uglify from 'gulp-uglify';
import webpack from 'webpack-stream';
import webp from 'gulp-webp';
import newer from 'gulp-newer';
import imagemin from 'gulp-imagemin';
import webphtml  from 'gulp-webp-html-nosvg';
import fs from 'fs';
import fonter from 'gulp-fonter';
// import imagemin from 'gulp-imagemin';

// 
var devMod = false;

const paths = {
    src: './src',
    build: './build',
    preBuild: './prebuild'
}

function cleanPreBuild() {
    return gulp.src(paths.preBuild, {read: false, allowEmpty: true})
        .pipe(gulpClean());
}

function cleanBuild() {
    return gulp.src(paths.build, {read: false, allowEmpty: true})
        .pipe(gulpClean());
}

function convertSaas(done) {
    return gulp.src(`${paths.src}/scss/style.scss`)
        .pipe(sass().on('error', sass.logError))
        .pipe(autoprefixer({
            cascade: false
        }))
        .pipe(gulp.dest(`${paths.src}/css/`));

    // done();
}

function css(done) {
    gulp.src(`${paths.src}/css/style.css`)
        .pipe(gulpif(devMod, sourcemaps.init()))
        .pipe(cleanCSS())
        .pipe(rename({suffix: ".min"}))
        .pipe(gulpif(devMod, sourcemaps.write()))
        .pipe(gulpif(devMod, gulp.dest(`${paths.preBuild}/css`)))
        .pipe(gulpif(!devMod, gulp.dest(`${paths.build}/css`)))
        .pipe(gulpif(devMod, browserSync.stream()));
    done();
}

/**
 * #TODO добавить gulp-version-number
 * #TODO доделать конвертацию img в webp формат
 *  
 */
function html(done) {
    gulp.src(`${paths.src}/index.html`)
        .pipe(inject(gulp.src([`${paths.src}/html/**.html`]), {
            starttag: '<!-- inject:{{path}} -->',
            removeTags: true,
            transform: function(filePath, file) {
                // console.log(filePath)
                return file.contents.toString('utf8')
            }
        }))
        .pipe(webphtml())
        .pipe(htmlmin({ collapseWhitespace: true }))
        // .pipe(rename({suffix: ".min"}))
        .pipe(gulpif(devMod, gulp.dest(paths.preBuild)))
        .pipe(gulpif(!devMod, gulp.dest(paths.build)))
        .pipe(gulpif(devMod, browserSync.stream()));
    done();
}

function js(done) {
    gulp.src(`${paths.src}/js/index.js`)
        .pipe(gulpif(devMod, webpack({
            devtool: 'source-map',
            mode: 'development',
            optimization: {
                minimize: true,
            },
        })))
        .on('error', console.log)
        .pipe(gulpif(!devMod, webpack({
            mode: 'production',
            optimization: {
                minimize: true,
            },
        })))
        .pipe(gulpif(devMod, sourcemaps.init()))
        // .pipe(uglify())
        .pipe(rename({suffix: ".min", basename: "script"}))
        .pipe(gulpif(devMod, sourcemaps.write()))
        .pipe(gulpif(devMod, gulp.dest(`${paths.preBuild}/js`)))
        .pipe(gulpif(!devMod, gulp.dest(`${paths.build}/js`)))
        .pipe(gulpif(devMod, browserSync.stream()));
    done();
}

function libs(done) {
    gulp.src(`${paths.src}/libs/*.js`, {allowEmpty: true})
        .pipe(gulpif(devMod, sourcemaps.init()))
        .pipe(concat('libs.js', {newLine: ';'}))
        .pipe(uglify())
        .pipe(rename({suffix: ".min"}))
        .pipe(gulpif(devMod, sourcemaps.write()))
        .pipe(gulpif(devMod, gulp.dest(`${paths.preBuild}/js`)))
        .pipe(gulpif(!devMod, gulp.dest(`${paths.build}/js`)))
        .pipe(gulpif(devMod, browserSync.stream()));
    done();
}

function images(done) {
    return gulp.src(`${paths.src}/img/*.{jpeg,jpg,png,svg,webp,ico}`)
        .pipe(gulpif(devMod, newer(`${paths.preBuild}/img`)))
        .pipe(gulpif(!devMod, newer(`${paths.build}/img`)))
        .pipe(webp())
        .pipe(gulpif(devMod, gulp.dest(`${paths.preBuild}/img`)))
        // .pipe(gulpif(!devMod, gulp.dest(`${paths.build}/img`)))
        .pipe(gulp.src(`${paths.src}/img/*.{jpeg,jpg,png,svg,webp,ico}`))
        .pipe(imagemin())
        .pipe(gulpif(devMod, gulp.dest(`${paths.preBuild}/img`)))
        .pipe(gulpif(!devMod, gulp.dest(`${paths.build}/img`)))
        .pipe(gulpif(devMod, browserSync.stream()));
    // done();
}

// ========================= Конвертация шрифтов =========================
export function createFontsScss(done) {
    const fontsScss = `${paths.src}/scss/fonts.scss`;
    fs.readdir(`${paths.src}/fonts/`, (err, files) => {
        if (files) {
            fs.writeFile(fontsScss, '/*     шрифты     */\n', (err) => {
                if (err) return console.log(err);
                console.log("file created");
            });
            for (let font of files) {
                // console.log(font);
                let fontFileName = font.split('.')[0];
                let fontName = fontFileName.split('-')[0];
                let fontWeight = fontFileName.split('-')[1];
                let fontStyle = 'normal';
                switch (fontWeight?.toLowerCase()) {
                    case ('thin' || 'hairline'):
                        fontWeight = '100';
                        break;
                    case ('thinitalic' || 'hairlineitalic'):
                        fontWeight = '100';
                        fontStyle = 'italic';
                        break;
                    case ('extralight' || 'ultralight'):
                        fontWeight = '200';
                        break;
                    case ('extralightitalic' || 'ultralightitalic'):
                        fontWeight = '200';
                        fontStyle = 'italic';
                        break;
                    case 'light':
                        fontWeight = '300';
                        break;
                    case 'lightitalic':
                        fontWeight = '300';
                        fontStyle = 'italic';
                        break;
                    case ('regular' || 'normal'):
                        fontWeight = '400';
                        break;
                    case ('italic'):
                        fontWeight = '400';
                        fontStyle = 'italic';
                        break;
                    case 'medium':
                        fontWeight = '500';
                        break;
                    case 'mediumitalic':
                        fontWeight = '500';
                        fontStyle = 'italic';
                        break;
                    case ('semibold' || 'demibold'):
                        fontWeight = '600';
                        break;
                    case ('semibolditalic' || 'demibolditalic'):
                        fontWeight = '600';
                        fontStyle = 'italic';
                        break;
                    case 'bold':
                        fontWeight = '700';
                        break;
                    case 'bolditalic':
                        fontWeight = '700';
                        fontStyle = 'italic';
                        break;
                    case ('extrabold' || 'ultrabold'):
                        fontWeight = '800';
                        break;
                    case ('extrabolditalic' || 'ultrabolditalic'):
                        fontWeight = '800';
                        fontStyle = 'italic';
                        break;
                    case ('black' || 'heavy'):
                        fontWeight = '900';
                        break;
                    case ('blackitalic' || 'heavyitalic'):
                        fontWeight = '900';
                        fontStyle = 'italic';
                        break;
                    case ('extrablack' || 'ultrablack'):
                        fontWeight = '950';
                        break;
                    case ('extrablack' || 'ultrablack'):
                        fontWeight = '950';
                        fontStyle = 'italic';
                        break;
                    default:
                        continue;
                }

                fs.appendFile(
                    fontsScss,
                    `@font-face {\n\tfont-family: "${fontName}";\n\tfont-display: swap;\n\tsrc: url("../fonts/${fontFileName}.woff") format(woff);\n\tfont-weight: ${fontWeight};\n\tfont-style: ${fontStyle};\n}\n\n`,
                    (err) => {
                        if (err) return console.log(err);
                    } 
                );

            }
            fs.appendFile(
                fontsScss,
                `/*----------------*/`,
                (err) => {
                    if (err) return console.log(err);
                } 
            );
        }
    });

    return gulp.src(paths.src);
}

function fonts(done) {
    gulp.src(`${paths.src}/fonts/*.{ttf,otf}`, {allowEmpty: true})
        .pipe(fonter({
            formats: ['woff']
        }))
        .pipe(gulpif(devMod, gulp.dest(`${paths.preBuild}/fonts`)))
        .pipe(gulpif(!devMod, gulp.dest(`${paths.build}/fonts`)))
    done();
}
// =======================================================================


function serverStart(done) {
    browserSync.init({
        server: {
            baseDir: paths.preBuild
        },
        port: 3000
    })
}

function browserReload(done) {
    browserSync.reload();
    done();
}

function watchSrc() {
    gulp.watch(`${paths.src}/scss/**/*.scss`, convertSaas);
    gulp.watch(`${paths.src}/css/style.css`, css);
    gulp.watch([
        `${paths.src}/components/*.html`,
        `${paths.src}/index.html`
    ], html);
    gulp.watch(`${paths.src}/js/**.js`, js);
    gulp.watch(`${paths.src}/libs/*.js`, libs);
    gulp.watch(`${paths.src}/img`, images)
    // watch([
    //     `${paths.preBuild}/index.html`
    // ], 
    // browserReload);
}

const packing = gulp.parallel(
    css,
    js,
    libs,
    images,
    fonts,
    html
);

export const build = gulp.series(
    cleanBuild,
    packing
);

export const dev = gulp.series(
    function(done) {
        devMod = true;
        done();
    },
    cleanPreBuild,
    createFontsScss,
    convertSaas,
    packing,
    gulp.parallel(serverStart, watchSrc)
);

export const clean = gulp.series(
    cleanPreBuild,
    cleanBuild
);