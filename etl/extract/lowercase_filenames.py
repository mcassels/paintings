"""
Rename all files in a directory so their names are lowercase.
"""
import sys
import os


def main(dir_name: str):
    filenames = [
        x for x in os.listdir(dir_name) if os.path.isfile(os.path.join(dir_name, x))
    ]

    for filename in filenames:
        if filename == ".DS_Store":
            continue
        lower = filename.lower()
        if lower == filename:
            continue
        src = os.path.join(dir_name, filename)
        dst = os.path.join(dir_name, lower)
        # On case-insensitive filesystems (macOS), src and dst may refer to the
        # same file, so os.path.exists(dst) would be True. Rename via a temp
        # name to handle this safely.
        if os.path.exists(dst) and dst != src and not os.path.samefile(src, dst):
            print(f"ERROR: cannot rename {filename} -> {lower}, destination already exists")
            continue
        tmp = os.path.join(dir_name, lower + ".tmp_rename")
        os.rename(src, tmp)
        os.rename(tmp, dst)
        print(f"{filename} -> {lower}")


# python3 lowercase_filenames.py "/path/to/directory"
if __name__ == "__main__":
    dir_name = sys.argv[1]
    main(dir_name)
